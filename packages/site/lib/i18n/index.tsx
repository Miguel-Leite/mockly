"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { pt, en, TranslationKeys } from "./dictionaries";

type Locale = "pt" | "en";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationKeys;
}

const dictionaries = { pt, en };

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("pt");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLocale = localStorage.getItem("mockario-locale") as Locale;
    if (savedLocale && (savedLocale === "pt" || savedLocale === "en")) {
      setLocale(savedLocale);
    }
  }, []);

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem("mockario-locale", newLocale);
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale: handleSetLocale, t: dictionaries[locale] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useTranslation must be used within an I18nProvider");
  }
  return context;
}

export function useLocale() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useLocale must be used within an I18nProvider");
  }
  return context;
}
