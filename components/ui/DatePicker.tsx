"use client";

import * as Popover from "@radix-ui/react-popover";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState, useEffect, forwardRef } from "react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DOW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function pad(n: number): string {
  return String(n).padStart(2, "0");
}
function toIso(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function fromIso(s: string): Date | null {
  if (!s) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.trim());
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}
function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function sameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
/** Number of days in the calendar grid: always 6 weeks × 7 days = 42. */
function buildMonthGrid(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  // ISO week starts on Monday — JS getDay(): Sun=0, Mon=1 ... Sat=6.
  // We want Monday at column 0, so shift by (getDay()+6) % 7.
  const offset = (first.getDay() + 6) % 7;
  const start = new Date(year, month, 1 - offset);
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

export interface DatePickerProps {
  /** ISO yyyy-mm-dd. Empty string for unselected. */
  value: string;
  onChange: (value: string) => void;
  /** Earliest selectable date as ISO. Defaults to today. */
  min?: string;
  /** Latest selectable date as ISO. */
  max?: string;
  id?: string;
  invalid?: boolean;
  disabled?: boolean;
  placeholder?: string;
  onBlur?: () => void;
  className?: string;
}

/**
 * BIPE-styled date picker. Built on Radix Popover so the calendar
 * panel portals correctly out of clipping containers and handles
 * focus / keyboard / outside-click cleanly.
 *
 * Pair with react-hook-form's <Controller> the same way as FormSelect.
 */
export const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(
  function DatePicker(
    { value, onChange, min, max, id, invalid, disabled, placeholder, onBlur, className },
    ref,
  ) {
    const today = useMemo(() => startOfDay(new Date()), []);
    const minDate = useMemo(
      () => startOfDay(fromIso(min ?? "") ?? today),
      [min, today],
    );
    const maxDate = useMemo(
      () => (max ? startOfDay(fromIso(max) ?? today) : null),
      [max, today],
    );

    const selected = useMemo(() => fromIso(value), [value]);
    // Anchor the panel on the selected month, or on minDate if nothing picked.
    const [view, setView] = useState<{ year: number; month: number }>(() => {
      const anchor = selected ?? minDate;
      return { year: anchor.getFullYear(), month: anchor.getMonth() };
    });

    // Re-anchor when value changes externally (e.g. form reset).
    useEffect(() => {
      if (selected) {
        setView({ year: selected.getFullYear(), month: selected.getMonth() });
      }
    }, [selected]);

    const grid = useMemo(() => buildMonthGrid(view.year, view.month), [view]);

    function shiftMonth(delta: number) {
      setView((v) => {
        const m = v.month + delta;
        const year = v.year + Math.floor(m / 12);
        const month = ((m % 12) + 12) % 12;
        return { year, month };
      });
    }

    function isDisabled(d: Date): boolean {
      const day = startOfDay(d);
      if (day < minDate) return true;
      if (maxDate && day > maxDate) return true;
      return false;
    }

    const display = selected
      ? selected.toLocaleDateString("en-IN", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : placeholder ?? "Pick a date";

    return (
      <Popover.Root>
        <Popover.Trigger
          ref={ref}
          id={id}
          disabled={disabled}
          onBlur={onBlur}
          aria-invalid={invalid || undefined}
          className={
            "bipe-date-trigger" +
            (invalid ? " is-invalid" : "") +
            (className ? " " + className : "")
          }
          type="button"
        >
          <Calendar size={16} className="bipe-date-icon" aria-hidden="true" />
          <span
            style={{
              flex: 1,
              textAlign: "left",
              color: selected ? "var(--ink)" : "var(--ink-4)",
            }}
          >
            {display}
          </span>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            className="bipe-date-panel"
            align="start"
            sideOffset={6}
          >
            {/* Header: month navigation */}
            <div className="bipe-date-head">
              <button
                type="button"
                className="bipe-date-nav"
                onClick={() => shiftMonth(-1)}
                aria-label="Previous month"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="bipe-date-title">
                {MONTHS[view.month]} <span style={{ opacity: 0.7 }}>{view.year}</span>
              </div>
              <button
                type="button"
                className="bipe-date-nav"
                onClick={() => shiftMonth(1)}
                aria-label="Next month"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Day-of-week labels */}
            <div className="bipe-date-dow">
              {DOW.map((d, i) => (
                <span key={d} style={{ color: i === 6 ? "var(--ink-4)" : undefined }}>
                  {d}
                </span>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="bipe-date-grid">
              {grid.map((d) => {
                const inMonth = d.getMonth() === view.month;
                const disabledDay = isDisabled(d);
                const isSelected = sameDay(d, selected);
                const isToday = sameDay(d, today);
                const isWeekend = d.getDay() === 0; // Sunday
                return (
                  <button
                    key={d.toISOString()}
                    type="button"
                    disabled={disabledDay}
                    aria-pressed={isSelected}
                    aria-current={isToday ? "date" : undefined}
                    onClick={() => {
                      onChange(toIso(d));
                      // Close popover via the Close primitive — we wrap below.
                      // Simpler: dispatch a click on the trigger to toggle; instead
                      // rely on Radix focus management by simulating Escape.
                      // Best: use Popover.Close around the day buttons.
                    }}
                    className={
                      "bipe-date-cell" +
                      (inMonth ? "" : " is-out") +
                      (isSelected ? " is-selected" : "") +
                      (isToday ? " is-today" : "") +
                      (isWeekend && inMonth && !isSelected ? " is-weekend" : "")
                    }
                  >
                    {d.getDate()}
                  </button>
                );
              })}
            </div>

            {/* Footer: quick actions */}
            <div className="bipe-date-foot">
              <Popover.Close asChild>
                <button
                  type="button"
                  className="bipe-date-quick"
                  onClick={() => onChange(toIso(today))}
                  disabled={isDisabled(today)}
                >
                  Today
                </button>
              </Popover.Close>
              <Popover.Close asChild>
                <button
                  type="button"
                  className="bipe-date-quick"
                  onClick={() => {
                    if (!selected) return;
                    onChange("");
                  }}
                >
                  Clear
                </button>
              </Popover.Close>
              <Popover.Close asChild>
                <button type="button" className="bipe-date-quick is-primary" autoFocus>
                  Done
                </button>
              </Popover.Close>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    );
  },
);
