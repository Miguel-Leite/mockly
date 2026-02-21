"use client";

import Link from "next/link";
import { Github, Menu, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { LanguageSwitch, SearchModal } from "./";
import { AnimatedThemeToggler } from "./ui";
import { motion, AnimatePresence } from "framer-motion";

const menu = [
  {
    label: "Docs",
    href: "/docs",
  },
  {
    label: "Features",
    href: "/#features",
  },
  {
    label: "Playground",
    href: "/#playground",
  },
  {
    label: "Blog",
    href: "/#blog",
  },
  {
    label: "Roadmap",
    href: "/#roadmap",
  },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky z-40 top-0 w-full border-b border-border bg-background/95 supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="shrink-0">
              <Image src="/logo.png" alt="Mockario" width={100} height={32} className="w-auto h-8" />
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              {menu.map((item) => (
                <Link key={item.href} href={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <SearchModal />
            <LanguageSwitch />
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
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 z-50 h-full w-64 bg-background border-l border-border shadow-lg"
            >
              <div className="flex flex-col p-4">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-semibold">Menu</span>
                  <button
                    className="p-2 rounded-md hover:bg-secondary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <nav className="flex flex-col gap-2">
                  {menu.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="px-3 py-2 text-sm rounded-md hover:bg-secondary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
