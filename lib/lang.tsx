"use client";

import React, { createContext, useContext, useEffect, useMemo, useSyncExternalStore } from "react";

export type Lang = "en" | "hi";

type LangCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
};

const STORAGE_KEY = "bipe-lang";

/**
 * The stored language, as an external store.
 *
 * localStorage is an external system, so useSyncExternalStore is the API
 * React provides for reading one. The provider previously held the language
 * in useState("en") and corrected it from localStorage in a mount effect --
 * which react-hooks/set-state-in-effect flags, because every visitor paid a
 * second render pass of the whole tree under the provider.
 *
 * getServerSnapshot() returns "en" for both the server render and the
 * hydration pass, so the markup still matches exactly as it did before, and
 * the stored language is applied immediately afterwards. Subscribing to the
 * `storage` event is a small bonus the old effect could not give: changing
 * the language in one tab now follows in the others.
 */
const listeners = new Set<() => void>();
let cached: Lang | null = null;

function readStored(): Lang {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "hi" || v === "en" ? v : "en";
  } catch {
    return "en";
  }
}

function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  // The first subscriber resolves the stored value. React re-reads the
  // snapshot straight after subscribing, so this is picked up without a nudge.
  if (cached === null) cached = readStored();

  const onStorage = (e: StorageEvent) => {
    if (e.key !== null && e.key !== STORAGE_KEY) return;
    cached = readStored();
    for (const l of listeners) l();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStorage);
  };
}

// A primitive, so referential stability across calls is free.
const getSnapshot = (): Lang => cached ?? "en";
const getServerSnapshot = (): Lang => "en";

function writeLang(next: Lang): void {
  cached = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Quota-exceeded or private mode — degrade to in-memory for this tab.
  }
  for (const l of listeners) l();
}

const Ctx = createContext<LangCtx>({ lang: "en", setLang: () => {} });

export function LangProvider({ children }: { children: React.ReactNode }) {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Mirroring onto the document element stays an effect: this is writing to
  // an external system on change, which is what effects are for.
  useEffect(() => {
    try {
      document.documentElement.lang = lang === "hi" ? "hi" : "en";
    } catch {}
  }, [lang]);

  const value = useMemo<LangCtx>(() => ({ lang, setLang: writeLang }), [lang]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLang(): LangCtx {
  return useContext(Ctx);
}
