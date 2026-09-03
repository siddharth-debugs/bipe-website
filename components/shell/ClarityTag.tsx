"use client";

import { useEffect } from "react";
import { clarityTag } from "@/lib/analytics";

/**
 * Tags the current Microsoft Clarity session with a key→value pair on
 * mount — used to mark the programme being viewed so replays/heatmaps
 * can be filtered by branch (e.g. "people who looked at Computer
 * Science & Engineering"). Renders nothing; no-op when Clarity isn't loaded
 * (localhost / preview).
 */
export default function ClarityTag({
  tagKey = "programme",
  value,
}: {
  tagKey?: string;
  value: string;
}) {
  useEffect(() => {
    if (value) clarityTag(tagKey, value);
  }, [tagKey, value]);
  return null;
}
