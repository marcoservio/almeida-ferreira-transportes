import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DriverTopbar } from "@/components/driver/driver-topbar";

// Área interna: fora do Google.
export const metadata: Metadata = {
  title: "Área do motorista",
  robots: { index: false, follow: false },
};

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: motorista } = await supabase
    .from("motoristas")
    .select("nome")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="flex min-h-svh flex-col bg-ink-50">
      <DriverTopbar
        name={motorista?.nome ?? user.email ?? "Motorista"}
        subtitle={motorista?.nome ? (user.email ?? undefined) : undefined}
      />

      <main className="flex-1">{children}</main>

      <footer className="border-t border-ink-100 bg-white py-6">
        <p className="mx-auto max-w-6xl px-4 text-center text-xs text-ink-500 sm:px-6">
          Almeida Ferreira Transportes · Área do motorista
        </p>
      </footer>
    </div>
  );
}
