import Link from "next/link";
import { 
  Truck, 
  MapPin, 
  Wrench, 
  Fuel, 
  DollarSign, 
  ShieldAlert, 
  Plus, 
  FileCheck2, 
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CalendarCheck
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const instant = false;

export const metadata = {
  title: "Dashboard ADM — Almeida Ferreira Transportes",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  // Buscar totais
  const { count: totalVeiculos } = await supabase.from("veiculos").select("id", { count: "exact", head: true });
  const { count: totalViagensAtivas } = await supabase.from("viagens").select("id", { count: "exact", head: true }).neq("status", "CONCLUIDA").neq("status", "CANCELADA");
  const { count: totalManutencoes } = await supabase.from("veiculos").select("id", { count: "exact", head: true }).eq("status", "MANUTENCAO");
  
  // Buscar Alertas Krona
  const hojeStr = new Date().toISOString().split("T")[0];
  const em15Dias = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const { data: alertasKrona } = await supabase
    .from("veiculos")
    .select("id, placa, modelo, checklist_krona_vencimento")
    .lte("checklist_krona_vencimento", em15Dias)
    .order("checklist_krona_vencimento", { ascending: true });

  // Buscar CNHs prestes a vencer
  const { data: alertasCnh } = await supabase
    .from("motoristas")
    .select("id, nome, cnh_vencimento")
    .lte("cnh_vencimento", em15Dias)
    .order("cnh_vencimento", { ascending: true });

  // Ultimas Viagens
  const { data: ultimasViagens } = await supabase
    .from("viagens")
    .select("*, motorista:motoristas(nome), cavalo:veiculos(placa)")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-8">
      {/* Cabeçalho do Dashboard */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-signal-500">
            Visão Geral Operacional
          </p>
          <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight text-ink-900 sm:text-4xl">
            Dashboard de Frota
          </h1>
        </div>

        {/* Botão de Ação Rápida */}
        <div className="flex gap-3">
          <Link
            href="/admin/viagens/nova"
            className="flex items-center gap-2 rounded-xl bg-signal-500 px-5 py-3 text-sm font-bold text-white shadow-glow transition-all hover:bg-signal-600"
          >
            <Plus className="size-4" />
            Nova Viagem
          </Link>
          <Link
            href="/admin/acertos"
            className="flex items-center gap-2 rounded-xl bg-brand-700 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-brand-800"
          >
            <DollarSign className="size-4" />
            Novo Acerto
          </Link>
        </div>
      </div>

      {/* Grid de Cards Métricas */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Veículos na Frota */}
        <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card transition-all hover:shadow-card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-400">Frota Total</span>
            <span className="flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Truck className="size-5" />
            </span>
          </div>
          <p className="mt-3 font-display text-3xl font-black text-ink-900">{totalVeiculos || 0}</p>
          <p className="mt-1 text-xs text-ink-500">Cavalos e Carretas cadastrados</p>
        </div>

        {/* Viagens Ativas */}
        <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card transition-all hover:shadow-card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-400">Viagens em Andamento</span>
            <span className="flex size-10 items-center justify-center rounded-xl bg-signal-50 text-signal-500">
              <MapPin className="size-5" />
            </span>
          </div>
          <p className="mt-3 font-display text-3xl font-black text-ink-900">{totalViagensAtivas || 0}</p>
          <p className="mt-1 text-xs text-ink-500">Em trânsito ou carregando</p>
        </div>

        {/* Veículos em Manutenção */}
        <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card transition-all hover:shadow-card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-400">Manutenção</span>
            <span className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Wrench className="size-5" />
            </span>
          </div>
          <p className="mt-3 font-display text-3xl font-black text-ink-900">{totalManutencoes || 0}</p>
          <p className="mt-1 text-xs text-ink-500">Em oficina ou reparo</p>
        </div>

        {/* Alerta Fechamento Plena */}
        <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card transition-all hover:shadow-card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-400">Fechamento Plena</span>
            <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CalendarCheck className="size-5" />
            </span>
          </div>
          <p className="mt-3 font-display text-lg font-bold text-ink-900">Alerta Semanal</p>
          <p className="mt-1 text-xs text-emerald-600 font-medium">Configuração Ativa</p>
        </div>
      </div>

      {/* Seção Principal: Alertas Críticos + Viagens */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Painel de Alertas de Vencimento Krona / CNH */}
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-card">
            <div className="flex items-center justify-between border-b border-ink-100 pb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="size-5 text-amber-600" />
                <h2 className="font-display text-lg font-bold uppercase tracking-tight text-ink-900">
                  Alertas Krona & CNH
                </h2>
              </div>
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                {(alertasKrona?.length || 0) + (alertasCnh?.length || 0)}
              </span>
            </div>

            <div className="mt-4 space-y-4">
              {/* Alertas Krona */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
                  Checklist Krona (Próximos Vencimentos)
                </p>
                {!alertasKrona || alertasKrona.length === 0 ? (
                  <p className="mt-2 text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="size-3.5" /> Todos os checklists Krona estão em dia.
                  </p>
                ) : (
                  <ul className="mt-2 divide-y divide-ink-100">
                    {alertasKrona.map((v) => (
                      <li key={v.id} className="py-2 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-mono font-bold text-ink-900">{v.placa}</span>
                          <span className="text-ink-500 ml-2">{v.modelo}</span>
                        </div>
                        <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {v.checklist_krona_vencimento ? new Date(v.checklist_krona_vencimento).toLocaleDateString("pt-BR") : "Vencido"}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Alertas CNH */}
              <div className="pt-3 border-t border-ink-100">
                <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
                  Vencimento de CNH (Motoristas)
                </p>
                {!alertasCnh || alertasCnh.length === 0 ? (
                  <p className="mt-2 text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="size-3.5" /> Nenhuma CNH vencendo nos próximos 15 dias.
                  </p>
                ) : (
                  <ul className="mt-2 divide-y divide-ink-100">
                    {alertasCnh.map((m) => (
                      <li key={m.id} className="py-2 flex items-center justify-between text-xs">
                        <span className="font-semibold text-ink-900">{m.nome}</span>
                        <span className="font-semibold text-signal-600 bg-signal-50 px-2 py-0.5 rounded border border-signal-200">
                          {new Date(m.cnh_vencimento).toLocaleDateString("pt-BR")}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabela de Viagens Recentes */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
            <div className="flex items-center justify-between border-b border-ink-100 pb-4">
              <div>
                <h2 className="font-display text-lg font-bold uppercase tracking-tight text-ink-900">
                  Últimas Viagens Registradas
                </h2>
                <p className="text-xs text-ink-500">Acompanhamento operacional em tempo real</p>
              </div>
              <Link
                href="/admin/viagens"
                className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-signal-500 hover:text-signal-600"
              >
                Ver Todas <ArrowRight className="size-3.5" />
              </Link>
            </div>

            {!ultimasViagens || ultimasViagens.length === 0 ? (
              <div className="py-12 text-center">
                <Truck className="mx-auto size-10 text-ink-300" />
                <p className="mt-2 text-sm font-semibold text-ink-600">Nenhuma viagem cadastrada ainda.</p>
                <Link
                  href="/admin/viagens/nova"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-signal-500 px-4 py-2 text-xs font-bold text-white shadow-glow"
                >
                  <Plus className="size-4" /> Cadastrar Primeira Viagem
                </Link>
              </div>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-ink-100 bg-ink-50 text-ink-400 font-bold uppercase tracking-wider">
                      <th className="px-4 py-3">Código / Rota</th>
                      <th className="px-4 py-3">Motorista</th>
                      <th className="px-4 py-3">Cavalo</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-100">
                    {ultimasViagens.map((viagem) => (
                      <tr key={viagem.id} className="hover:bg-ink-50/50">
                        <td className="px-4 py-3 font-medium">
                          <p className="font-bold text-ink-900">{viagem.codigo_viagem}</p>
                          <p className="text-ink-500">{viagem.origem} → {viagem.destino}</p>
                        </td>
                        <td className="px-4 py-3 font-semibold text-ink-800">
                          {viagem.motorista?.nome || "—"}
                        </td>
                        <td className="px-4 py-3 font-mono font-bold text-ink-900">
                          {viagem.cavalo?.placa || "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-700 border border-brand-200">
                            {viagem.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            href={`/admin/viagens/${viagem.id}/liberacao`}
                            className="inline-flex items-center gap-1 rounded-lg bg-ink-900 px-3 py-1.5 font-bold text-white text-[11px] hover:bg-ink-950"
                          >
                            <FileCheck2 className="size-3 text-signal-500" /> Checklist
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
