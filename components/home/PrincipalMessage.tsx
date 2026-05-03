import React from "react";
import Image from "next/image";
import { BIPE_IMG } from "@/lib/images";

export const PrincipalMessage = () => (
  <section className="section" style={{ background: "var(--ink)", color: "var(--paper)" }}>
    <div className="container">
      <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 60, alignItems: "center" }}>
        <div className="reveal" style={{ position: "relative", aspectRatio: "4/5", borderRadius: 18, overflow: "hidden", border: "1px solid color-mix(in oklab, var(--paper) 20%, transparent)" }}>
          <Image
            src={BIPE_IMG.principal}
            alt="Principal of BIPE"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>
        <div className="reveal">
          <div className="eyebrow" style={{ color: "var(--accent)" }}>Principal&apos;s Message</div>
          <p className="serif" style={{ fontSize: "clamp(28px, 3vw, 40px)", lineHeight: 1.2, marginTop: 18, color: "var(--paper)" }}>
            &quot;We don&apos;t promise glamour. We promise that when your child walks out of BIPE in three years, they will be an engineer who can hold a tool, read a drawing, lead a team — and pay for their own life.&quot;
          </p>
          <div style={{ marginTop: 24, fontSize: 14, opacity: 0.75 }}>— Rahul Srivastava · Principal, BIPE</div>
        </div>
      </div>
    </div>
  </section>
);
