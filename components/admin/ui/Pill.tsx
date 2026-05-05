import { cn } from "@/lib/admin/utils";

export type PillTone =
  | "default"
  | "brand"
  | "accent"
  | "success"
  | "danger"
  | "warning"
  | "ink"
  | "ghost";

interface PillProps {
  children: React.ReactNode;
  tone?: PillTone;
  /** Hide the leading dot. Default false. */
  noDot?: boolean;
  className?: string;
  /** Optional small icon before the text (replaces the dot). */
  icon?: React.ReactNode;
}

const TONE: Record<PillTone, string> = {
  default: "",
  brand: "admin-pill-brand",
  accent: "admin-pill-accent",
  success: "admin-pill-success",
  danger: "admin-pill-danger",
  warning: "admin-pill-warning",
  ink: "admin-pill-ink",
  ghost: "admin-pill-ghost",
};

export function Pill({ children, tone = "default", noDot, className, icon }: PillProps) {
  return (
    <span
      className={cn(
        "admin-pill",
        TONE[tone],
        (noDot || icon) && "admin-pill-no-dot",
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
