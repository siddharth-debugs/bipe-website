interface PageHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  /** Optional italic serif accent word that follows the title. */
  accent?: string;
  /** Sub-line below the title. */
  description?: string;
  /** Right-side content (counts, action buttons). */
  right?: React.ReactNode;
}

/**
 * Editorial-style page header that mirrors the public site's section
 * intros — mono caps eyebrow over a sans heading, with an optional
 * italic serif accent word in brand colour.
 */
export function PageHeader({ eyebrow, title, accent, description, right }: PageHeaderProps) {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "end",
        justifyContent: "space-between",
        paddingBottom: 22,
        borderBottom: "1px solid var(--line)",
        flexWrap: "wrap",
        gap: 18,
        marginBottom: 24,
      }}
    >
      <div>
        <div className="admin-eyebrow">§ {eyebrow}</div>
        <h1 className="admin-h1" style={{ marginTop: 8 }}>
          {title}
          {accent && (
            <>
              {" "}
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: "var(--brand)",
                  letterSpacing: "-0.02em",
                }}
              >
                {accent}
              </span>
            </>
          )}
        </h1>
        {description && (
          <p style={{ color: "var(--ink-3)", marginTop: 6, fontSize: 14, maxWidth: "62ch" }}>
            {description}
          </p>
        )}
      </div>
      {right && <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>{right}</div>}
    </header>
  );
}
