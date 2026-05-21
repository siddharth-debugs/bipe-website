"use client";

import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { forwardRef } from "react";

export interface SelectOption {
  value: string;
  label: string;
  /** Optional supporting text shown beneath the label inside the menu. */
  hint?: string;
  disabled?: boolean;
}

export interface FormSelectProps {
  /** Currently-selected value. Pass `""` for "no selection yet". */
  value: string;
  /** Fired with the chosen option's `value`. */
  onValueChange: (value: string) => void;
  options: SelectOption[];
  /** Shown when `value` is empty. */
  placeholder?: string;
  /** Inputs are paired with <label htmlFor> in our forms; surface that id here. */
  id?: string;
  /** Used by react-hook-form's Controller. */
  name?: string;
  /** Highlights the trigger in the danger colour for invalid fields. */
  invalid?: boolean;
  disabled?: boolean;
  /** For Controller integration — receives focus/blur. */
  onBlur?: () => void;
  className?: string;
  /** Pretty grouping — when set, options are searched here for the trigger label. */
  label?: string;
  /**
   * Mirrors the parent form's REQUIRED-field set. When true, the underlying
   * Radix trigger gets `aria-required="true"`, so screen readers announce
   * "required" alongside the label. Omit (or pass false) for optional fields —
   * we intentionally don't emit `aria-required="false"`, which some readers
   * misread.
   */
  required?: boolean;
  /**
   * Element id of the paired error message span. When set, the trigger
   * carries `aria-describedby` pointing at it so the message is read after
   * the label. Convention: `${id}-err`.
   */
  describedBy?: string;
}

/**
 * BIPE-styled select. Built on Radix to get keyboard navigation,
 * accessibility, custom styling, and proper portalled positioning.
 *
 * Pair it with react-hook-form's <Controller> for forms:
 *
 *   <Controller name="branch" control={control} render={({ field }) => (
 *     <FormSelect
 *       value={field.value || ""}
 *       onValueChange={field.onChange}
 *       onBlur={field.onBlur}
 *       options={BRANCHES}
 *       placeholder="Choose a branch…"
 *     />
 *   )} />
 */
export const FormSelect = forwardRef<HTMLButtonElement, FormSelectProps>(
  function FormSelect(
    { value, onValueChange, options, placeholder, id, name, invalid, disabled, onBlur, className, required, describedBy },
    ref,
  ) {
    return (
      <Select.Root
        value={value || undefined}
        onValueChange={onValueChange}
        disabled={disabled}
        name={name}
      >
        <Select.Trigger
          ref={ref}
          id={id}
          onBlur={onBlur}
          aria-invalid={invalid || undefined}
          aria-required={required || undefined}
          aria-describedby={describedBy}
          className={"bipe-select-trigger" + (invalid ? " is-invalid" : "") + (className ? " " + className : "")}
        >
          <Select.Value placeholder={placeholder ?? "Select…"} />
          <Select.Icon className="bipe-select-caret" asChild>
            <ChevronDown size={16} />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            className="bipe-select-content"
            position="popper"
            sideOffset={6}
            align="start"
            // Keep the menu pinned to the trigger's width so layouts feel solid
            style={{ width: "var(--radix-select-trigger-width)", maxHeight: 320 }}
          >
            <Select.ScrollUpButton className="bipe-select-scroll-btn">
              <ChevronUp size={14} />
            </Select.ScrollUpButton>

            <Select.Viewport style={{ padding: 4 }}>
              {options.map((o) => (
                <Select.Item
                  key={o.value}
                  value={o.value}
                  disabled={o.disabled}
                  className="bipe-select-item"
                >
                  <Select.ItemIndicator className="bipe-select-indicator">
                    <Check size={14} />
                  </Select.ItemIndicator>
                  <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                    <Select.ItemText>{o.label}</Select.ItemText>
                    {o.hint && (
                      <span
                        style={{
                          fontSize: 11,
                          color: "var(--ink-3)",
                          marginTop: 2,
                          fontWeight: 400,
                        }}
                      >
                        {o.hint}
                      </span>
                    )}
                  </div>
                </Select.Item>
              ))}
            </Select.Viewport>

            <Select.ScrollDownButton className="bipe-select-scroll-btn">
              <ChevronDown size={14} />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    );
  },
);
