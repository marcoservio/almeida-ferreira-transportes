"use client";

import { useEffect, useState } from "react";
import { Bell, Calendar, ShieldAlert, UserCheck, CheckCircle2, Headset } from "lucide-react";
import { DriverLogoutButton } from "@/components/driver/logout-button";
import { createClient } from "@/lib/supabase/client";

interface AlertaResumo {
  kronaCount: number;
  cnhCount: number;
  crlvCount: number;
}

export function AdminTopbar() {
  const [alertas, setAlertas] = useState<AlertaResumo>({ kronaCount: 0, cnhCount: 0, crlvCount: 0 });
  const [dataHoje, setDataHoje] = useState<string>("");

  useEffect(() => {
    setDataHoje(
      new Intl.DateTimeFormat("pt-BR", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date())
    );

    async function carregarAlertas() {
      const supabase = createClient();
      
      const hojeStr = new Date().toISOString().split("T")[0];
      const em15Dias = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

      // Krona
      const { count: krona } = await supabase
        .from("veiculos")
        .select("id", { count: "exact", head: true })
        .lte("checklist_krona_vencimento", em15Dias);

      // CNH
      const { count: cnh } = await supabase
        .from("motoristas")
        .select("id", { count: "exact", head: true })
        .lte("cnh_vencimento", em15Dias);

      // CRLV
      const { count: crlv } = await supabase
        .from("veiculos")
        .select("id", { count: "exact", head: true })
        .lte("crlv_vencimento", em15Dias);

      setAlertas({
        kronaCount: krona || 0,
        cnhCount: cnh || 0,
        crlvCount: crlv || 0,
      });
    }

    carregarAlertas();
  }, []);

  const totalAlertas = alertas.kronaCount + alertas.cnhCount + alertas.crlvCount;

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-ink-100 bg-white px-8 shadow-sm">
      {/* Esquerda: Identificação */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="font-display text-lg font-bold uppercase tracking-tight text-ink-900">
            Painel Administrativo
          </h1>
          <p className="text-xs text-ink-500">
            Almeida Ferreira Transportes LTDA · Betim/MG
          </p>
        </div>
      </div>

      {/* Direita: Alertas, Data e Sair */}
      <div className="flex items-center gap-5">
        {/* Banner de Alertas */}
        {totalAlertas > 0 ? (
          <div className="flex items-center gap-2.5 rounded-xl bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-900 border border-amber-200">
            <ShieldAlert className="size-4 text-amber-600 animate-pulse" />
            <span>
              {totalAlertas} alerta{totalAlertas > 1 ? "s" : ""} de vencimento (Krona/CNH/CRLV)
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="size-4 text-emerald-600" />
            <span>Documentações e Krona em dia</span>
          </div>
        )}

        {/* Data */}
        <div className="flex items-center gap-2 text-xs font-semibold text-ink-600 bg-ink-50 px-3.5 py-2 rounded-xl border border-ink-100">
          <Calendar className="size-4 text-brand-600" />
          <span className="capitalize">{dataHoje}</span>
        </div>

        {/* Sair */}
        <div className="bg-ink-900 rounded-xl p-1 text-white">
          <DriverLogoutButton />
        </div>
      </div>
    </header>
  );
}
