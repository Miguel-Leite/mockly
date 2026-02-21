"use client";

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { I18nProvider } from "@/lib/i18n";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <I18nProvider>
        {children}
      </I18nProvider>
    </ThemeProvider>
  );
}
