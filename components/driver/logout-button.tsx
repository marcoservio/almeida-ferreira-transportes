"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useResetAoVoltar } from "@/components/auth/use-reset-ao-voltar";

export function DriverLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Destrava o botão se a página voltar do cache do navegador.
  useResetAoVoltar(() => setLoading(false));

  const logout = async () => {
    setLoading(true);

    try {
      const supabase = createClient();
      await supabase.auth.signOut();

      // `replace` evita que o /protected fique no histórico e `refresh`
      // descarta o cache do router, para os dados da sessão não reaparecerem.
      router.replace("/auth/login");
      router.refresh();
    } catch (error) {
      console.error("[auth] falha ao sair:", error);
    } finally {
      // Nunca deixa o botão preso: se a navegação falhar, ele volta a funcionar.
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={logout}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10 disabled:opacity-60"
    >
      <LogOut className="size-4" />
      <span className="hidden sm:inline">{loading ? "Saindo…" : "Sair"}</span>
    </button>
  );
}
