import React from "react";

export const PageHeader = ({ eyebrow, title, lead, children }: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  children?: React.ReactNode;
}) => (
  <section className="section" style={{ paddingTop: 50, paddingBottom: 40, borderBottom: "1px solid var(--line)" }}>
    <div className="container">
      <div className="eyebrow">{eyebrow}</div>
      <h1 className="bipe-h1" style={{ marginTop: 14, maxWidth: "22ch" }}>{title}</h1>
      {lead && <p className="lead" style={{ marginTop: 18 }}>{lead}</p>}
      {children}
    </div>
  </section>
);
