"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Lang = "en" | "hi";

type LangCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
};

const Ctx = createContext<LangCtx>({ lang: "en", setLang: () => {} });

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("bipe-lang");
      if (stored === "en" || stored === "hi") {
        setLangState(stored);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      document.documentElement.lang = lang === "hi" ? "hi" : "en";
      window.localStorage.setItem("bipe-lang", lang);
    } catch {}
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);

  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>;
}

export function useLang(): LangCtx {
  return useContext(Ctx);
}
