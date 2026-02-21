"use client";

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -80% 0px" }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  return (
    <nav className="hidden xl:block w-64 shrink-0">
      <div className="sticky top-24">
        <h4 className="text-sm font-medium mb-4 text-foreground">On this page</h4>
        <ul className="space-y-2 text-sm">
          {items.map((item) => (
            <li
              key={item.id}
              style={{ paddingLeft: (item.level - 1) * 12 }}
            >
              <a
                href={`#${item.id}`}
                className={`block py-1 transition-colors ${
                  activeId === item.id
                    ? "text-green-600 font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
