"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Check } from "lucide-react";
import type { SubmissionStatus } from "@/lib/admin/api";
import { Pill, type PillTone } from "./Pill";

const STATUSES: { value: SubmissionStatus; label: string; tone: PillTone }[] = [
  { value: "new", label: "New", tone: "brand" },
  { value: "contacted", label: "Contacted", tone: "accent" },
  { value: "qualified", label: "Qualified", tone: "warning" },
  { value: "enrolled", label: "Enrolled", tone: "success" },
  { value: "rejected", label: "Rejected", tone: "danger" },
  { value: "spam", label: "Spam", tone: "danger" },
];

const STATUS_TONE: Record<SubmissionStatus, PillTone> = STATUSES.reduce(
  (acc, s) => ({ ...acc, [s.value]: s.tone }),
  {} as Record<SubmissionStatus, PillTone>,
);

const STATUS_LABEL: Record<SubmissionStatus, string> = STATUSES.reduce(
  (acc, s) => ({ ...acc, [s.value]: s.label }),
  {} as Record<SubmissionStatus, string>,
);

export function statusTone(s: SubmissionStatus): PillTone {
  return STATUS_TONE[s] ?? "default";
}
export function statusLabel(s: SubmissionStatus): string {
  return STATUS_LABEL[s] ?? s;
}

interface StatusDropdownProps {
  value: SubmissionStatus;
  onChange: (next: SubmissionStatus) => void;
  disabled?: boolean;
}

/**
 * Inline status changer styled as a clickable pill with a caret.
 * Clicking opens a Radix dropdown; selecting a value calls `onChange`.
 */
export function StatusDropdown({ value, onChange, disabled }: StatusDropdownProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            border: "none",
            background: "transparent",
            padding: 0,
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.6 : 1,
          }}
          aria-label={`Change status (current: ${statusLabel(value)})`}
        >
          <Pill tone={statusTone(value)}>{statusLabel(value)}</Pill>
          <ChevronDown size={14} color="var(--ink-3)" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="admin-menu-content" align="start" sideOffset={6}>
          <div className="admin-menu-label">Change status</div>
          {STATUSES.map((s) => (
            <DropdownMenu.Item
              key={s.value}
              className="admin-menu-item"
              data-state={s.value === value ? "checked" : undefined}
              onSelect={() => onChange(s.value)}
            >
              <span style={{ width: 14, display: "inline-flex" }}>
                {s.value === value && <Check size={14} color="var(--brand)" />}
              </span>
              <Pill tone={s.tone}>{s.label}</Pill>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
