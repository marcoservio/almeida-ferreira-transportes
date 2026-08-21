"use client";

import { useEffect, useState } from "react";
import { BellRing, ShieldAlert, CheckCircle2, CalendarCheck, Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AlertasPage() {
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const [diasKrona, setDiasKrona] = useState(7);
  const [diasCnh, setDiasCnh] = useState(15);
  const [diasPlena, setDiasPlena] = useState(3);
  const [emailNotificacoes, setEmailNotificacoes] = useState("almeidaferreiratransportes@gmail.com");

  const supabase = createClient();

  const handleSalvarConfigs = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSucesso(false);

    await supabase.from("configuracoes_alertas").upsert([
      { chave: "ALERTA_KRONA", descricao: "Alerta Krona", dias_antecedencia: diasKrona, emails_notificacao: emailNotificacoes },
      { chave: "ALERTA_CNH", descricao: "Alerta CNH", dias_antecedencia: diasCnh, emails_notificacao: emailNotificacoes },
      { chave: "ALERTA_FECHAMENTO_PLENA", descricao: "Alerta Plena", dias_antecedencia: diasPlena, emails_notificacao: emailNotificacoes },
    ]);

    setSucesso(true);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-signal-500">
          Automação & Notificações
        </p>
        <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight text-ink-900">
          Configuração de Alertas do Sistema
        </h1>
        <p className="text-sm text-ink-500">
          Gerencie prazos de antecedência para alertas de Checklist Krona, Validade de CNH/CRLV e Fechamento Plena Alimentos.
        </p>
      </div>

      {sucesso && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="size-4 text-emerald-600" /> Configurações de alerta atualizadas com sucesso!
        </div>
      )}

      <form onSubmit={handleSalvarConfigs} className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card space-y-6">
        <h2 className="font-display text-lg font-bold uppercase text-ink-900 border-b border-ink-100 pb-3 flex items-center gap-2">
          <Settings className="size-5 text-brand-600" /> Prazos de Antecedência de Alertas
        </h2>

        {/* Krona */}
        <div className="flex items-center justify-between p-4 bg-amber-50/60 rounded-xl border border-amber-200">
          <div className="space-y-0.5">
            <h3 className="font-bold text-sm text-amber-950 flex items-center gap-2">
              <ShieldAlert className="size-4 text-amber-600" /> Checklist Krona (Veículos)
            </h3>
            <p className="text-xs text-amber-800">Alertar no sistema quando o vencimento do checklist Krona estiver próximo.</p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              value={diasKrona}
              onChange={(e) => setDiasKrona(parseInt(e.target.value) || 1)}
              className="w-20 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-center text-sm font-bold text-amber-900"
            />
            <span className="text-xs font-bold text-amber-900">dias</span>
          </div>
        </div>

        {/* CNH & CRLV */}
        <div className="flex items-center justify-between p-4 bg-ink-50 rounded-xl border border-ink-100">
          <div className="space-y-0.5">
            <h3 className="font-bold text-sm text-ink-900">CNH dos Motoristas e CRLV dos Veículos</h3>
            <p className="text-xs text-ink-500">Notificar renovação de habilitação e licenciamento de veículos.</p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              value={diasCnh}
              onChange={(e) => setDiasCnh(parseInt(e.target.value) || 1)}
              className="w-20 rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-center text-sm font-bold text-ink-900"
            />
            <span className="text-xs font-bold text-ink-700">dias</span>
          </div>
        </div>

        {/* Fechamento Plena Alimentos */}
        <div className="flex items-center justify-between p-4 bg-emerald-50/60 rounded-xl border border-emerald-200">
          <div className="space-y-0.5">
            <h3 className="font-bold text-sm text-emerald-950 flex items-center gap-2">
              <CalendarCheck className="size-4 text-emerald-600" /> Fechamento Plena Alimentos
            </h3>
            <p className="text-xs text-emerald-800">Alerta semanal de fechamento para a operação Plena Alimentos.</p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              value={diasPlena}
              onChange={(e) => setDiasPlena(parseInt(e.target.value) || 1)}
              className="w-20 rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-center text-sm font-bold text-emerald-900"
            />
            <span className="text-xs font-bold text-emerald-900">dias</span>
          </div>
        </div>

        {/* Email de Notificações */}
        <div className="pt-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-ink-700">
            E-mail para Recebimento de Alertas
          </label>
          <input
            type="email"
            value={emailNotificacoes}
            onChange={(e) => setEmailNotificacoes(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-ink-200 px-3.5 py-2.5 text-sm font-medium text-ink-900"
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-ink-100">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-signal-500 px-6 py-3 text-xs font-bold text-white shadow-glow"
          >
            {loading ? "Salvando..." : "Salvar Configurações de Alerta"}
          </button>
        </div>
      </form>
    </div>
  );
}
