import { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminTopbar } from "@/components/admin/topbar";

export const instant = false;

export const metadata = {
  title: "Painel ADM — Almeida Ferreira Transportes",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-ink-50 font-sans text-ink-900">
      <AdminSidebar />
      <div className="pl-64 flex flex-col min-h-screen">
        <AdminTopbar />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
