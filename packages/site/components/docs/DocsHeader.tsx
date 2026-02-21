"use client";

import Link from "next/link";
import { Github, Menu, X, BookOpen, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { SearchModal } from "../SearchModal";
import { AnimatedThemeToggler } from "../ui";
import { usePathname } from "next/navigation";

export function DocsHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky z-40 top-0 w-full border-b border-border bg-background/95 supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="shrink-0">
            <img src="/logo.png" alt="Mockario" className="h-8 w-auto" />
          </Link>
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <span>/</span>
            <Link href="/docs" className="hover:text-foreground transition-colors">
              Docs
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <SearchModal />
          <AnimatedThemeToggler duration={400} />
          <a
            href="https://github.com/Miguel-Leite/mockario"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-md hover:bg-secondary transition-colors"
            aria-label="GitHub"
          >
            <Github className="h-5 w-5" />
          </a>
          <button
            className="md:hidden p-2 rounded-md hover:bg-secondary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
