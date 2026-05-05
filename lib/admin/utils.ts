import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDate(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Append a timestamped line to an existing remarks/notes blob. Used by
 * the status auditor and the quick-remark presets so admins build up a
 * readable history without manually typing dates.
 */
export function appendRemark(existing: string, line: string): string {
  const stamp = new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const next = `[${stamp}] ${line.trim()}`;
  const trimmed = existing.trim();
  return trimmed ? `${trimmed}\n${next}` : next;
}
