"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  ChevronDown,
  Menu,
  X,
  Rocket,
  Download,
  Zap,
  Database,
  Shield,
  Send,
  FileText,
} from "lucide-react";

const navSections = [
  {
    title: "Getting Started",
    icon: BookOpen,
    items: [
      { title: "Introduction", href: "/docs/getting-started" },
      { title: "Installation", href: "/docs/installation" },
      { title: "Quick Start", href: "/docs/quick-start" },
    ],
  },
  {
    title: "Features",
    icon: Zap,
    items: [
      { title: "Endpoints", href: "/docs/features/endpoints" },
      { title: "Schemas", href: "/docs/features/schemas" },
      { title: "Authentication", href: "/docs/features/authentication" },
    ],
  },
  {
    title: "HTTP Client",
    icon: Send,
    items: [
      { title: "Overview", href: "/docs/http-client" },
    ],
  },
  {
    title: "API Reference",
    icon: FileText,
    items: [
      { title: "REST API", href: "/docs/api-reference" },
    ],
  },
];

function NavGroup({ section, currentPath }: { section: typeof navSections[0]; currentPath: string }) {
  const [isOpen, setIsOpen] = useState(
    section.items.some((item) => item.href === currentPath)
  );

  const isActive = section.items.some((item) => item.href === currentPath);

  return (
    <div className="mb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          isActive
            ? "text-green-600 bg-green-600/10"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
        }`}
      >
        <div className="flex items-center gap-2">
          <section.icon className="h-4 w-4" />
          <span>{section.title}</span>
        </div>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="ml-4 mt-1 space-y-1 border-l border-border pl-2">
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-1.5 text-sm rounded-md transition-colors ${
                    currentPath === item.href
                      ? "text-green-600 bg-green-600/10 font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DocsSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <div className="h-full overflow-y-auto py-4 px-3">
      <div className="mb-6 px-3">
        <Link href="/docs/getting-started" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-green-600 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <span className="font-semibold">Docs</span>
        </Link>
      </div>
      <nav>
        {navSections.map((section) => (
          <NavGroup key={section.title} section={section} currentPath={pathname} />
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="lg:hidden fixed top-20 left-4 z-50 p-2 rounded-md bg-background border border-border shadow-sm"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-30 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="lg:hidden fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-72 bg-background border-r border-border"
          >
            {sidebarContent}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 bg-background border-r border-border">
        {sidebarContent}
      </aside>
    </>
  );
}
