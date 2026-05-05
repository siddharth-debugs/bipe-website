import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = "No submissions yet",
  description = "When the public form is submitted, rows will land here.",
  icon,
}: EmptyStateProps) {
  return (
    <div className="admin-empty">
      <div className="admin-empty-icon">{icon ?? <Inbox size={20} />}</div>
      <div style={{ color: "var(--ink)", fontWeight: 600, fontSize: 14 }}>{title}</div>
      <div style={{ marginTop: 4, fontSize: 13 }}>{description}</div>
    </div>
  );
}
