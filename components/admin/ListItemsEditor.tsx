"use client";

import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/**
 * Field declaration for a single column in a list-of-items editor.
 *
 *   key         — object property the value lands at on each row
 *   label       — visible label shown above the input
 *   placeholder — hint inside the empty input
 *   widget      — input | textarea (rendered as <Input> or <Textarea>)
 *   width       — flex-basis CSS hint inside the row layout
 *                  (defaults to "1fr")
 *   help        — optional short hint shown under the label
 */
export interface FieldDef {
  key: string;
  label: string;
  placeholder?: string;
  widget?: "input" | "textarea";
  width?: string;
  help?: string;
}

interface Props {
  items: Record<string, unknown>[];
  setItems: (next: Record<string, unknown>[]) => void;
  fields: FieldDef[];
  /** Object shape used when "+ Add" is clicked. Falls back to {} */
  newItemTemplate?: Record<string, unknown>;
  /** Label for the add button (defaults to "+ Add item") */
  addLabel?: string;
  /** Label shown above each row card (defaults to "Item") */
  rowLabel?: string;
  /** Show a numeric prefix (1, 2, 3…) on each row card */
  numbered?: boolean;
}

/**
 * Generic, dependency-free editor for an array of typed objects.
 *
 * Used by the per-section editors (Stats / WhyBipe / FAQ / Facilities /
 * JeecupSteps) so each one only has to declare its `fields` schema and
 * an empty-row template; the add / remove / edit plumbing is shared.
 *
 * The rendered HTML uses a `repeat(auto-fit, minmax(160px, 1fr))` grid
 * across fields so the editor reflows responsively on narrow screens.
 */
export function ListItemsEditor({
  items, setItems, fields,
  newItemTemplate, addLabel = "+ Add item", rowLabel = "Item", numbered = true,
}: Props) {
  const blank = useMemo(() => {
    const t: Record<string, unknown> = {};
    fields.forEach((f) => { t[f.key] = ""; });
    return { ...t, ...(newItemTemplate || {}) };
  }, [fields, newItemTemplate]);

  function patch(i: number, key: string, value: string) {
    const next = items.map((row, j) => j === i ? { ...row, [key]: value } : row);
    setItems(next);
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = items.slice();
    [next[i], next[j]] = [next[j], next[i]];
    setItems(next);
  }
  function remove(i: number) {
    setItems(items.filter((_, j) => j !== i));
  }
  function add() {
    setItems([...items, { ...blank }]);
  }

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <div style={{
          padding: "18px 20px",
          border: "1px dashed var(--line)",
          borderRadius: 12,
          color: "var(--ink-3)",
          fontSize: 13,
          textAlign: "center",
        }}>
          No items yet. Click <strong>{addLabel}</strong> below to add the first one.
        </div>
      )}

      {items.map((row, i) => (
        <div key={i} style={{
          padding: 14,
          borderRadius: 10,
          border: "1px solid var(--line)",
          background: "var(--paper)",
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}>
            <div style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--ink-3)",
            }}>
              {rowLabel} {numbered ? `#${i + 1}` : ""}
            </div>
            <div className="flex gap-1">
              <Button type="button" variant="ghost" size="sm" disabled={i === 0}
                      onClick={() => move(i, -1)} title="Move up">↑</Button>
              <Button type="button" variant="ghost" size="sm" disabled={i === items.length - 1}
                      onClick={() => move(i, 1)} title="Move down">↓</Button>
              <Button type="button" variant="outline" size="sm"
                      className="text-[var(--danger,#c13b2b)]"
                      onClick={() => remove(i)}>Remove</Button>
            </div>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 10,
          }}>
            {fields.map((f) => {
              const inputId = `f_${i}_${f.key}`;
              const val = String(row[f.key] ?? "");
              return (
                <div key={f.key} className="space-y-1" style={{
                  // Let textarea fields span the full row.
                  gridColumn: f.widget === "textarea" ? "1 / -1" : (f.width ?? "auto"),
                }}>
                  <Label htmlFor={inputId} style={{ fontSize: 11, color: "var(--ink-3)" }}>
                    {f.label}
                  </Label>
                  {f.widget === "textarea" ? (
                    <Textarea id={inputId} rows={3} value={val}
                              placeholder={f.placeholder}
                              onChange={(e) => patch(i, f.key, e.target.value)} />
                  ) : (
                    <Input id={inputId} value={val}
                           placeholder={f.placeholder}
                           onChange={(e) => patch(i, f.key, e.target.value)} />
                  )}
                  {f.help && (
                    <div style={{ fontSize: 10, color: "var(--ink-3)" }}>{f.help}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={add}>{addLabel}</Button>
    </div>
  );
}
