import { DocsHeader } from "@/components/docs/DocsHeader";
import { DocsSidebar } from "@/components/docs/DocsSidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <DocsHeader />
      <DocsSidebar />
      <main className="lg:pl-64 pt-16">
        <div className="container mx-auto px-4 py-8 lg:max-w-4xl">
          {children}
        </div>
      </main>
    </div>
  );
}
