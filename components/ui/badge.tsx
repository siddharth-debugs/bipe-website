import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/admin/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.06em] transition-colors whitespace-nowrap",
  {
    variants: {
      variant: {
        default:
          "border-[var(--line)] bg-[var(--paper-2)] text-[var(--ink-2)]",
        brand:
          "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand)]",
        accent:
          "border-[color-mix(in_oklab,var(--accent)_30%,transparent)] bg-[color-mix(in_oklab,var(--accent)_14%,var(--white))] text-[var(--accent-deep,var(--accent))]",
        success:
          "border-[color-mix(in_oklab,var(--success,#2e7d52)_30%,transparent)] bg-[color-mix(in_oklab,var(--success,#2e7d52)_12%,var(--white))] text-[var(--success,#2e7d52)]",
        destructive:
          "border-[color-mix(in_oklab,var(--danger,#c13b2b)_30%,transparent)] bg-[color-mix(in_oklab,var(--danger,#c13b2b)_10%,var(--white))] text-[var(--danger,#c13b2b)]",
        outline: "text-[var(--ink-2)] border-[var(--line)]",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant }), className)}
      style={{ fontFamily: "var(--font-mono)" }}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
