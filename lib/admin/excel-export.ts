/**
 * Export the admin inbox to a styled multi-sheet Excel workbook.
 *
 * Sheets:
 *   1. Overview      — counts by kind / status, plus header card
 *   2. All Leads     — one row per deduped prospect (mirrors inbox view)
 *   3. Apply         — every apply submission, all fields
 *   4. Contact       — every contact submission
 *   5. Enquiry       — every enquiry submission
 *   6. Visit         — every visit submission
 *   7. Follow-ups    — every operator-logged follow-up
 *
 * Styling: brand-coloured header band, frozen header row, autofilter,
 * banded rows, sensible column widths, ISO timestamps formatted as
 * readable date+time. ExcelJS does the heavy lifting; file-saver
 * triggers the download in-browser.
 *
 * Loaded dynamically from the Inbox page so the exceljs bundle
 * (~600 kB) only ships when an operator actually clicks "Export".
 */

import type ExcelJSNS from "exceljs";

import type { FollowUp } from "@/lib/admin/api";
import type { AnyRow, LeadGroup } from "@/lib/admin/leads";
import { statusBucket } from "@/lib/admin/leads";

// ─── Style tokens ────────────────────────────────────────────────────────
const BRAND_HEX = "FF1B3A6E"; // BIPE brand navy, ARGB
const BRAND_TINT_HEX = "FFE8EDF6";
const ACCENT_HEX = "FFF59E0B"; // accent amber
const PAPER_HEX = "FFF6F4EE";
const ROW_BAND_HEX = "FFFAFAF7";
const INK_HEX = "FF0A1A3F";
const INK_2_HEX = "FF374264";

// ─── Helpers ─────────────────────────────────────────────────────────────
function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso ?? "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}`
  );
}

function statusLabel(g: LeadGroup): string {
  const labels = {
    new: "New",
    in_progress: "In progress",
    closed_win: "Closed (won)",
    closed_loss: "Closed (lost)",
    spam: "Spam",
  } as const;
  return labels[statusBucket(g)];
}

function safeFilename(now = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `BIPE-inbox-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(
      now.getDate(),
    )}-${pad(now.getHours())}${pad(now.getMinutes())}.xlsx`
  );
}

// Apply the same header-band styling across every sheet.
function styleHeaderRow(ws: ExcelJSNS.Worksheet, headerRowIdx = 1) {
  const row = ws.getRow(headerRowIdx);
  row.height = 26;
  row.eachCell((cell) => {
    cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND_HEX } };
    cell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
    cell.border = {
      top: { style: "thin", color: { argb: BRAND_HEX } },
      bottom: { style: "thin", color: { argb: BRAND_HEX } },
      left: { style: "thin", color: { argb: BRAND_HEX } },
      right: { style: "thin", color: { argb: BRAND_HEX } },
    };
  });
  ws.views = [{ state: "frozen", ySplit: headerRowIdx }];
}

// Light row banding + base styling on data rows.
function styleDataRows(ws: ExcelJSNS.Worksheet, startRow: number) {
  const lastRow = ws.rowCount;
  for (let r = startRow; r <= lastRow; r++) {
    const row = ws.getRow(r);
    row.height = 20;
    const banded = (r - startRow) % 2 === 1;
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.font = { name: "Calibri", size: 11, color: { argb: INK_HEX } };
      cell.alignment = { vertical: "middle", horizontal: "left", indent: 1, wrapText: true };
      cell.border = {
        bottom: { style: "hair", color: { argb: "FFE5E7EB" } },
      };
      if (banded) {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: ROW_BAND_HEX } };
      }
    });
  }
}

interface SheetColumn {
  header: string;
  key: string;
  width: number;
}

function setupSheet(
  ws: ExcelJSNS.Worksheet,
  cols: SheetColumn[],
) {
  ws.columns = cols;
  ws.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: cols.length },
  };
}

// ─── Main entry ──────────────────────────────────────────────────────────
export async function exportInboxToExcel(opts: {
  rows: AnyRow[];
  leadGroups: LeadGroup[];
  followUpsByKey: Record<string, FollowUp[]>;
}) {
  const { rows, leadGroups, followUpsByKey } = opts;

  const ExcelJS = (await import("exceljs")).default;
  const { saveAs } = await import("file-saver");

  const wb = new ExcelJS.Workbook();
  wb.creator = "BIPE Admin";
  wb.created = new Date();
  wb.lastModifiedBy = "BIPE Admin Inbox";
  wb.title = "BIPE Inbox Export";
  wb.company = "Banaras Institute of Polytechnic & Engineering";

  // ── Sheet 1: Overview ─────────────────────────────────────────────────
  const ov = wb.addWorksheet("Overview", {
    properties: { tabColor: { argb: BRAND_HEX } },
    views: [{ showGridLines: false }],
  });

  ov.columns = [
    { width: 4 },
    { width: 32 },
    { width: 18 },
    { width: 32 },
    { width: 18 },
  ];

  // Big title block (row 2)
  ov.mergeCells("B2:E2");
  const titleCell = ov.getCell("B2");
  titleCell.value = "BIPE — Inbox Export";
  titleCell.font = { name: "Georgia", size: 22, bold: true, color: { argb: INK_HEX } };
  titleCell.alignment = { vertical: "middle", horizontal: "left" };
  ov.getRow(2).height = 36;

  ov.mergeCells("B3:E3");
  const subCell = ov.getCell("B3");
  subCell.value = `Generated ${fmtDate(new Date().toISOString())} · ${leadGroups.length} leads · ${rows.length} submissions`;
  subCell.font = { name: "Calibri", size: 11, italic: true, color: { argb: INK_2_HEX } };
  ov.getRow(3).height = 18;

  // Spacer row
  ov.getRow(4).height = 14;

  // KPI table heading
  ov.mergeCells("B5:E5");
  const kpiHead = ov.getCell("B5");
  kpiHead.value = "Snapshot";
  kpiHead.font = { name: "Calibri", size: 10, bold: true, color: { argb: BRAND_HEX } };
  kpiHead.alignment = { vertical: "middle", horizontal: "left" };
  ov.getRow(5).height = 20;
  // Underline
  ov.getCell("B5").border = {
    bottom: { style: "thin", color: { argb: BRAND_HEX } },
  };

  const kindCounts = { apply: 0, contact: 0, enquiry: 0, visit: 0 };
  for (const r of rows) kindCounts[r.kind]++;

  const statusCounts: Record<string, number> = {
    new: 0, in_progress: 0, closed_win: 0, closed_loss: 0, spam: 0,
  };
  for (const g of leadGroups) statusCounts[statusBucket(g)]++;

  const kpiRows: [string, number, string, number][] = [
    ["Apply submissions",   kindCounts.apply,   "New leads",          statusCounts.new],
    ["Contact submissions", kindCounts.contact, "In progress",        statusCounts.in_progress],
    ["Enquiry submissions", kindCounts.enquiry, "Closed (won)",       statusCounts.closed_win],
    ["Visit submissions",   kindCounts.visit,   "Closed (lost)",      statusCounts.closed_loss],
    ["Total submissions",   rows.length,        "Flagged spam",       statusCounts.spam],
  ];

  let kpiRow = 6;
  for (const [l1, v1, l2, v2] of kpiRows) {
    const r = ov.getRow(kpiRow);
    r.height = 22;
    r.getCell(2).value = l1;
    r.getCell(3).value = v1;
    r.getCell(4).value = l2;
    r.getCell(5).value = v2;
    r.getCell(2).font = { name: "Calibri", size: 11, color: { argb: INK_2_HEX } };
    r.getCell(4).font = { name: "Calibri", size: 11, color: { argb: INK_2_HEX } };
    r.getCell(3).font = { name: "Calibri", size: 12, bold: true, color: { argb: INK_HEX } };
    r.getCell(5).font = { name: "Calibri", size: 12, bold: true, color: { argb: INK_HEX } };
    r.getCell(3).alignment = { horizontal: "right", indent: 1 };
    r.getCell(5).alignment = { horizontal: "right", indent: 1 };
    r.getCell(2).alignment = { vertical: "middle", horizontal: "left", indent: 1 };
    r.getCell(4).alignment = { vertical: "middle", horizontal: "left", indent: 1 };
    if ((kpiRow - 6) % 2 === 1) {
      [2, 3, 4, 5].forEach((c) => {
        r.getCell(c).fill = {
          type: "pattern", pattern: "solid", fgColor: { argb: BRAND_TINT_HEX },
        };
      });
    }
    kpiRow++;
  }

  // Spacer + sheet index
  ov.getRow(kpiRow).height = 14;
  kpiRow++;
  ov.mergeCells(`B${kpiRow}:E${kpiRow}`);
  const idxHead = ov.getCell(`B${kpiRow}`);
  idxHead.value = "Sheets in this workbook";
  idxHead.font = { name: "Calibri", size: 10, bold: true, color: { argb: BRAND_HEX } };
  idxHead.border = { bottom: { style: "thin", color: { argb: BRAND_HEX } } };
  ov.getRow(kpiRow).height = 20;
  kpiRow++;

  const sheetIndex: [string, string][] = [
    ["All Leads",   "One row per prospect (deduped by phone)"],
    ["Apply",       "Application form submissions"],
    ["Contact",     "Contact form submissions"],
    ["Enquiry",     "Enquiry / WhatsApp submissions"],
    ["Visit",       "Campus-visit bookings"],
    ["Follow-ups",  "Every operator-logged follow-up"],
  ];
  for (const [name, desc] of sheetIndex) {
    const r = ov.getRow(kpiRow);
    r.height = 18;
    r.getCell(2).value = name;
    r.getCell(2).font = { name: "Calibri", size: 11, bold: true, color: { argb: BRAND_HEX } };
    ov.mergeCells(`C${kpiRow}:E${kpiRow}`);
    r.getCell(3).value = desc;
    r.getCell(3).font = { name: "Calibri", size: 11, color: { argb: INK_2_HEX } };
    r.getCell(2).alignment = { vertical: "middle", horizontal: "left", indent: 1 };
    r.getCell(3).alignment = { vertical: "middle", horizontal: "left", indent: 1 };
    kpiRow++;
  }

  // ── Sheet 2: All Leads ────────────────────────────────────────────────
  const leadsWs = wb.addWorksheet("All Leads", {
    properties: { tabColor: { argb: ACCENT_HEX } },
  });
  setupSheet(leadsWs, [
    { header: "Latest submission",  key: "latest",        width: 20 },
    { header: "Name",               key: "name",          width: 26 },
    { header: "Primary phone",      key: "phone",         width: 16 },
    { header: "Other phones",       key: "otherPhones",   width: 22 },
    { header: "Email(s)",           key: "emails",        width: 32 },
    { header: "Interest / branch",  key: "branches",      width: 28 },
    { header: "Status",             key: "status",        width: 16 },
    { header: "Apply",              key: "apply",         width:  8 },
    { header: "Contact",            key: "contact",       width:  8 },
    { header: "Enquiry",            key: "enquiry",       width:  9 },
    { header: "Visit",              key: "visit",         width:  8 },
    { header: "Follow-ups",         key: "followUps",     width: 12 },
    { header: "Interest course",    key: "interestCourse",width: 24 },
    { header: "Last outcome",       key: "lastOutcome",   width: 18 },
  ]);
  for (const g of leadGroups) {
    leadsWs.addRow({
      latest: fmtDate(g.latestAt),
      name: g.name || "—",
      phone: g.phones[0] || "",
      otherPhones: g.phones.slice(1).join(", "),
      emails: g.emails.join(", "),
      branches: g.branches.join(", "),
      status: statusLabel(g),
      apply: g.kindCounts.apply || "",
      contact: g.kindCounts.contact || "",
      enquiry: g.kindCounts.enquiry || "",
      visit: g.kindCounts.visit || "",
      followUps: g.followUpCount || "",
      interestCourse: g.interestCourse || "",
      lastOutcome: g.lastOutcome || "",
    });
  }
  styleHeaderRow(leadsWs);
  styleDataRows(leadsWs, 2);

  // ── Sheet 3: Apply ────────────────────────────────────────────────────
  const applyWs = wb.addWorksheet("Apply", { properties: { tabColor: { argb: "FF22C55E" } } });
  setupSheet(applyWs, [
    { header: "Submitted",     key: "createdAt", width: 20 },
    { header: "Name",          key: "name",      width: 26 },
    { header: "Phone",         key: "phone",     width: 16 },
    { header: "Email",         key: "email",     width: 30 },
    { header: "Branch",        key: "branch",    width: 26 },
    { header: "Category",      key: "category",  width: 14 },
    { header: "Parent",        key: "parent",    width: 22 },
    { header: "Board",         key: "board",     width: 14 },
    { header: "Marks",         key: "marks",     width: 10 },
    { header: "Source",        key: "source",    width: 18 },
    { header: "Visit?",        key: "visit",     width: 10 },
    { header: "Visit date",    key: "visitDate", width: 14 },
    { header: "Visit time",    key: "visitTime", width: 12 },
    { header: "Notes",         key: "notes",     width: 40 },
    { header: "Status",        key: "status",    width: 14 },
    { header: "Admin notes",   key: "adminNotes",width: 32 },
  ]);
  for (const r of rows) {
    if (r.kind !== "apply") continue;
    applyWs.addRow({
      createdAt: fmtDate(r.created_at),
      name: r.name,
      phone: r.phone,
      email: r.email,
      branch: r.branch,
      category: r.category,
      parent: r.parent,
      board: r.board,
      marks: r.marks,
      source: r.source,
      visit: r.visit,
      visitDate: r.visit_date,
      visitTime: r.visit_time,
      notes: r.notes,
      status: r.status,
      adminNotes: r.admin_notes,
    });
  }
  styleHeaderRow(applyWs);
  styleDataRows(applyWs, 2);

  // ── Sheet 4: Contact ──────────────────────────────────────────────────
  const contactWs = wb.addWorksheet("Contact", { properties: { tabColor: { argb: "FF3B82F6" } } });
  setupSheet(contactWs, [
    { header: "Submitted",   key: "createdAt", width: 20 },
    { header: "Name",        key: "name",      width: 26 },
    { header: "Phone",       key: "phone",     width: 16 },
    { header: "Email",       key: "email",     width: 30 },
    { header: "Branch",      key: "branch",    width: 26 },
    { header: "Source",      key: "source",    width: 18 },
    { header: "Message",     key: "message",   width: 50 },
    { header: "Status",      key: "status",    width: 14 },
    { header: "Admin notes", key: "adminNotes",width: 32 },
  ]);
  for (const r of rows) {
    if (r.kind !== "contact") continue;
    contactWs.addRow({
      createdAt: fmtDate(r.created_at),
      name: r.name,
      phone: r.phone,
      email: r.email,
      branch: r.branch,
      source: r.source,
      message: r.message,
      status: r.status,
      adminNotes: r.admin_notes,
    });
  }
  styleHeaderRow(contactWs);
  styleDataRows(contactWs, 2);

  // ── Sheet 5: Enquiry ──────────────────────────────────────────────────
  const enquiryWs = wb.addWorksheet("Enquiry", { properties: { tabColor: { argb: "FFA855F7" } } });
  setupSheet(enquiryWs, [
    { header: "Submitted",   key: "createdAt", width: 20 },
    { header: "Name",        key: "name",      width: 26 },
    { header: "Phone",       key: "phone",     width: 16 },
    { header: "Email",       key: "email",     width: 30 },
    { header: "Branch",      key: "branch",    width: 26 },
    { header: "Source",      key: "source",    width: 18 },
    { header: "Message",     key: "message",   width: 50 },
    { header: "Status",      key: "status",    width: 14 },
    { header: "Admin notes", key: "adminNotes",width: 32 },
  ]);
  for (const r of rows) {
    if (r.kind !== "enquiry") continue;
    enquiryWs.addRow({
      createdAt: fmtDate(r.created_at),
      name: r.name,
      phone: r.phone,
      email: r.email,
      branch: r.branch,
      source: r.source,
      message: r.message,
      status: r.status,
      adminNotes: r.admin_notes,
    });
  }
  styleHeaderRow(enquiryWs);
  styleDataRows(enquiryWs, 2);

  // ── Sheet 6: Visit ────────────────────────────────────────────────────
  const visitWs = wb.addWorksheet("Visit", { properties: { tabColor: { argb: "FFEC4899" } } });
  setupSheet(visitWs, [
    { header: "Submitted",    key: "createdAt",   width: 20 },
    { header: "Name",         key: "name",        width: 26 },
    { header: "Phone",        key: "phone",       width: 16 },
    { header: "Email",        key: "email",       width: 30 },
    { header: "Branch",       key: "branch",      width: 26 },
    { header: "Visit date",   key: "visitDate",   width: 14 },
    { header: "Visit time",   key: "visitTime",   width: 12 },
    { header: "Party",        key: "party",       width: 22 },
    { header: "Needs shuttle",key: "needsShuttle",width: 14 },
    { header: "Notes",        key: "notes",       width: 40 },
    { header: "Status",       key: "status",      width: 14 },
    { header: "Admin notes",  key: "adminNotes",  width: 32 },
  ]);
  for (const r of rows) {
    if (r.kind !== "visit") continue;
    visitWs.addRow({
      createdAt: fmtDate(r.created_at),
      name: r.name,
      phone: r.phone,
      email: r.email,
      branch: r.branch,
      visitDate: r.visit_date,
      visitTime: r.visit_time,
      party: r.party,
      needsShuttle: r.needs_shuttle ? "Yes" : "No",
      notes: r.notes,
      status: r.status,
      adminNotes: r.admin_notes,
    });
  }
  styleHeaderRow(visitWs);
  styleDataRows(visitWs, 2);

  // ── Sheet 7: Follow-ups ───────────────────────────────────────────────
  const fuWs = wb.addWorksheet("Follow-ups", { properties: { tabColor: { argb: "FF6B7280" } } });
  setupSheet(fuWs, [
    { header: "Logged at",       key: "createdAt", width: 20 },
    { header: "Lead key (phone)",key: "leadKey",   width: 18 },
    { header: "Medium",          key: "medium",    width: 14 },
    { header: "Outcome",         key: "outcome",   width: 18 },
    { header: "Status set",      key: "status",    width: 16 },
    { header: "Interest course", key: "interest",  width: 24 },
    { header: "Notes",           key: "notes",     width: 60 },
    { header: "Logged by",       key: "by",        width: 18 },
  ]);
  const allFollowUps: FollowUp[] = [];
  for (const arr of Object.values(followUpsByKey)) allFollowUps.push(...arr);
  allFollowUps.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  for (const f of allFollowUps) {
    fuWs.addRow({
      createdAt: fmtDate(f.createdAt),
      leadKey: f.leadKey,
      medium: f.medium,
      outcome: f.outcome,
      status: f.status,
      interest: f.interestCourse,
      notes: f.remarks,
      by: f.createdBy ?? "",
    });
  }
  styleHeaderRow(fuWs);
  styleDataRows(fuWs, 2);

  // ── Write & download ──────────────────────────────────────────────────
  const buf = await wb.xlsx.writeBuffer();
  const blob = new Blob([buf], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, safeFilename());
}
