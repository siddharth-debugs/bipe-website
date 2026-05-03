import React from "react";
import Link from "next/link";
import { DATA } from "@/lib/data";
import { ArrowIcon, PhoneIcon, WhatsAppIcon } from "./Icons";

export const StickyCTA = () => (
  <div className="cta-bar" role="region" aria-label="Quick actions">
    <a href={DATA.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-wa btn-sm">
      <WhatsAppIcon /> WhatsApp
    </a>
    <a href={`tel:${DATA.contact.phone}`} className="btn btn-ghost btn-sm">
      <PhoneIcon /> Call
    </a>
    <Link href="/visit" className="btn btn-ghost btn-sm hide-md">Book visit</Link>
    <Link href="/apply" className="btn btn-primary btn-sm">
      Apply <ArrowIcon />
    </Link>
  </div>
);
