"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Truck, 
  MapPin, 
  Plus, 
  FileCheck2, 
  ArrowRight, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  RefreshCw,
  Search,
  UserCheck,
  Trash2
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Viagem, StatusViagem } from "@/lib/supabase/types";

const ETAPAS: { key: StatusViagem; label: string; bg: string; border: string; text: string }[] = [
  { key: "GARAGEM", label: "Na Garagem", bg: "bg-ink-50", border: "border-ink-200", text: "text-ink-700" },
  { key: "SAIU_GARAGEM", label: "Saiu Garagem", bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700" },
  { key: "EM_TRANSITO", label: "Em Trânsito", bg: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-700" },
  { key: "CHEGOU_DESTINO", label: "Chegou Destino", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" },
  { key: "CARREGANDO_DESCARREGANDO", label: "Carga/Descarga", bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700" },
  { key: "EM_RETORNO", label: "Em Retorno", bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700" },
  { key: "CONCLUIDA", label: "Concluída", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },
];

export default function ViagensPage() {
  const [viagens, setViagens] = useState<Viagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");

  const supabase = createClient();

  const carregarViagens = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("viagens")
      .select("*, motorista:motoristas(nome), cavalo:veiculos!viagens_cavalo_id_fkey(placa), carreta:veiculos!viagens_carreta_id_fkey(placa)")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setViagens(data as unknown as Viagem[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    carregarViagens();
  }, []);

  const handleExcluirViagem = async (id: number, codigo: string) => {
    if (confirm(`Tem certeza que deseja excluir a viagem ${codigo}?`)) {
      const { error } = await supabase.from("viagens").delete().eq("id", id);
      if (!error) {
        carregarViagens();
      } else {
        alert("Erro ao apagar viagem: " + error.message);
      }
    }
  };

  const avancarStatus = async (viagemId: number, statusAtual: StatusViagem) => {
    const etapasKeys = ETAPAS.map((e) => e.key);
    const idx = etapasKeys.indexOf(statusAtual);
    if (idx >= 0 && idx < etapasKeys.length - 1) {
      const proximoStatus = etapasKeys[idx + 1];
      const { error } = await supabase
        .from("viagens")
        .update({ status: proximoStatus, updated_at: new Date().toISOString() })
        .eq("id", viagemId);

      if (!error) {
        carregarViagens();
      }
    }
  };

  const viagensFiltradas = viagens.filter((v) =>
    (v.codigo_viagem || "").toLowerCase().includes(busca.toLowerCase()) ||
    (v.origem || "").toLowerCase().includes(busca.toLowerCase()) ||
    (v.destino || "").toLowerCase().includes(busca.toLowerCase()) ||
    (v.motorista?.nome || "").toLowerCase().includes(busca.toLowerCase()) ||
    (v.cavalo?.placa || "").toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-signal-500">
            Acompanhamento em Tempo Real
          </p>
          <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight text-ink-900">
            Quadro de Viagens (Kanban)
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={carregarViagens}
            className="flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-xs font-bold text-ink-700 shadow-sm transition-all hover:bg-ink-50"
          >
            <RefreshCw className="size-3.5 text-brand-600" /> Atualizar
          </button>
          <Link
            href="/admin/viagens/nova"
            className="flex items-center gap-2 rounded-xl bg-signal-500 px-5 py-2.5 text-xs font-bold text-white shadow-glow transition-all hover:bg-signal-600"
          >
            <Plus className="size-4" /> Nova Viagem
          </Link>
        </div>
      </div>

      {/* Barra de Busca */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 size-4 text-ink-400" />
        <input
          type="text"
          placeholder="Buscar por código, cidade, motorista ou placa..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full rounded-xl border border-ink-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-ink-900 placeholder:text-ink-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
      </div>

      {/* Kanban de Etapas */}
      {loading ? (
        <div className="py-20 text-center text-sm font-semibold text-ink-500">
          Carregando quadro operacional...
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 overflow-x-auto pb-6 sm:grid-cols-2 lg:grid-cols-7 min-w-[1200px]">
          {ETAPAS.map((etapa) => {
            const itensEtapa = viagensFiltradas.filter((v) => v.status === etapa.key);

            return (
              <div
                key={etapa.key}
                className={`flex flex-col rounded-2xl border ${etapa.border} bg-white p-3 shadow-card min-h-[500px]`}
              >
                {/* Cabeçalho da Coluna */}
                <div className={`flex items-center justify-between rounded-xl ${etapa.bg} px-3 py-2 border ${etapa.border}`}>
                  <span className={`text-xs font-extrabold uppercase tracking-wider ${etapa.text}`}>
                    {etapa.label}
                  </span>
                  <span className={`rounded-full bg-white px-2 py-0.5 text-xs font-black ${etapa.text} shadow-sm`}>
                    {itensEtapa.length}
                  </span>
                </div>

                {/* Cards da Coluna */}
                <div className="mt-3 flex-1 space-y-3 overflow-y-auto pr-1">
                  {itensEtapa.length === 0 ? (
                    <div className="py-8 text-center text-[11px] font-medium text-ink-400 border border-dashed border-ink-200 rounded-xl">
                      Nenhuma viagem
                    </div>
                  ) : (
                    itensEtapa.map((viagem) => (
                      <div
                        key={viagem.id}
                        className="rounded-xl border border-ink-100 bg-white p-3.5 shadow-sm transition-all hover:border-brand-300 hover:shadow-card"
                      >
                        {/* Código & Detalhes */}
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-ink-900">
                            {viagem.codigo_viagem}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <Link
                              href={`/admin/viagens/${viagem.id}/liberacao`}
                              className="flex items-center gap-1 rounded bg-ink-900 px-2 py-1 text-[10px] font-bold text-white hover:bg-signal-500"
                              title="Checklist de Liberação dos 9 Passos"
                            >
                              <FileCheck2 className="size-3 text-signal-400" />
                              Checklist
                            </Link>
                            <button
                              onClick={() => handleExcluirViagem(viagem.id, viagem.codigo_viagem)}
                              className="rounded p-1 text-ink-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                              title="Excluir Viagem"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Rota */}
                        <div className="mt-2.5">
                          <p className="text-xs font-bold text-ink-900 leading-tight">
                            {viagem.origem}
                          </p>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-signal-500">
                            ↓
                          </p>
                          <p className="text-xs font-bold text-ink-900 leading-tight">
                            {viagem.destino}
                          </p>
                        </div>

                        {/* Motorista e Veículo */}
                        <div className="mt-3 pt-2.5 border-t border-ink-100 space-y-1 text-[11px]">
                          <p className="font-medium text-ink-700 truncate">
                            👤 {viagem.motorista?.nome || "Sem motorista"}
                          </p>
                          <p className="font-mono font-semibold text-ink-600">
                            🚛 {viagem.cavalo?.placa || "—"} {viagem.carreta ? `+ ${viagem.carreta.placa}` : ""}
                          </p>
                        </div>

                        {/* Botão Avançar Status */}
                        {etapa.key !== "CONCLUIDA" && (
                          <button
                            onClick={() => avancarStatus(viagem.id, viagem.status)}
                            className="mt-3 w-full flex items-center justify-center gap-1.5 rounded-lg border border-ink-200 bg-ink-50 py-1.5 text-[11px] font-bold text-ink-800 transition-colors hover:bg-brand-700 hover:text-white hover:border-brand-700"
                          >
                            <span>Avançar Etapa</span>
                            <ChevronRight className="size-3" />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
