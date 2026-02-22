"use client";

import Link from "next/link";
import { Github, Package } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border dark:bg-neutral-950 bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Image src="/logo.png" alt="Mockario" width={100} height={32} />
            </Link>
            <span className="text-sm dark:text-muted-foreground text-neutral-600">
              {t.home.subtitle}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Miguel-Leite/mockario"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm dark:text-muted-foreground text-neutral-600 hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
              {t.common.github}
            </a>
            <a
              href="https://www.npmjs.com/package/@mockario/mockario"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm dark:text-muted-foreground text-neutral-600 hover:text-foreground transition-colors"
            >
              <Package className="h-4 w-4" />
              {t.common.npm}
            </a>
          </div>
        </div>
        <div className="mt-4 text-center text-sm dark:text-muted-foreground text-neutral-500">
          © {new Date().getFullYear()} Mockario. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
