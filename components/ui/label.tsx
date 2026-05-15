"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "@/lib/admin/utils";

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "text-[10.5px] font-mono uppercase tracking-[0.14em] text-[var(--ink-3)] font-medium",
      className,
    )}
    style={{ fontFamily: "var(--font-mono)" }}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
