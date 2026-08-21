"use client";

import { useEffect, useState } from "react";
import { Layers, Plus, Truck, Users, CheckCircle2, ShieldAlert, Search, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { VinculoConjunto, Motorista, Veiculo } from "@/lib/supabase/types";
import { formatarErroBanco } from "@/lib/db-errors";
import { FormErrorAlert } from "@/components/admin/form-error-alert";

export default function ConjuntosPage() {
  const [conjuntos, setConjuntos] = useState<VinculoConjunto[]>([]);
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [cavalos, setCavalos] = useState<Veiculo[]>([]);
  const [carretas, setCarretas] = useState<Veiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [busca, setBusca] = useState("");

  const [motoristaId, setMotoristaId] = useState("");
  const [cavaloId, setCavaloId] = useState("");
  const [carretaId, setCarretaId] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState("");

  const supabase = createClient();

  const carregarDados = async () => {
    setLoading(true);

    const { data: conjData } = await supabase
      .from("vinculos_conjunto")
      .select("*, motorista:motoristas(nome, cpf), cavalo:veiculos!vinculos_conjunto_cavalo_id_fkey(placa, modelo, marca), carreta:veiculos!vinculos_conjunto_carreta_id_fkey(placa, modelo, tipo_carreta)")
      .order("created_at", { ascending: false });

    const { data: motData } = await supabase.from("motoristas").select("*").eq("ativo", true);
    const { data: cavData } = await supabase.from("veiculos").select("*").eq("tipo", "CAVALO").eq("ativo", true);
    const { data: carData } = await supabase.from("veiculos").select("*").eq("tipo", "CARRETA").eq("ativo", true);

    if (conjData) setConjuntos(conjData as unknown as VinculoConjunto[]);
    if (motData) setMotoristas(motData as Motorista[]);
    if (cavData) setCavalos(cavData as Veiculo[]);
    if (carData) setCarretas(carData as Veiculo[]);
    setLoading(false);
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleSalvarConjunto = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErro("");

    if (!motoristaId || !cavaloId) {
      setErro("Selecione obrigatoriamente o Motorista e o Cavalo.");
      setSaving(false);
      return;
    }

    const motId = parseInt(motoristaId);
    const cavId = parseInt(cavaloId);
    const carId = carretaId ? parseInt(carretaId) : null;

    // Desativar vínculos anteriores deste motorista
    await supabase
      .from("vinculos_conjunto")
      .update({ ativo: false, data_fim: new Date().toISOString() })
      .eq("motorista_id", motId)
      .eq("ativo", true);

    // Criar novo conjunto ativo
    const { error } = await supabase.from("vinculos_conjunto").insert({
      motorista_id: motId,
      cavalo_id: cavId,
      carreta_id: carId,
      ativo: true,
      observacoes: observacoes || null,
    });

    if (error) {
      setErro(formatarErroBanco(error));
    } else {
      // Atualizar o motorista_id no cavalo e carreta
      await supabase.from("veiculos").update({ motorista_id: motId }).eq("id", cavId);
      if (carId) {
        await supabase.from("veiculos").update({ motorista_id: motId }).eq("id", carId);
      }

      setModalAberto(false);
      setMotoristaId("");
      setCavaloId("");
      setCarretaId("");
      setObservacoes("");
      carregarDados();
    }
    setSaving(false);
  };

  const handleExcluirConjunto = async (id: number) => {
    if (confirm("Tem certeza que deseja desvincular / excluir este conjunto?")) {
      const { error } = await supabase.from("vinculos_conjunto").delete().eq("id", id);
      if (!error) {
        carregarDados();
      } else {
        setErro(formatarErroBanco(error));
      }
    }
  };

  const conjuntosFiltrados = conjuntos.filter((c) =>
    (c.motorista?.nome || "").toLowerCase().includes(busca.toLowerCase()) ||
    (c.cavalo?.placa || "").toLowerCase().includes(busca.toLowerCase()) ||
    (c.carreta?.placa || "").toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-signal-500">
            Formação de Frota & Operação
          </p>
          <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight text-ink-900">
            Gestão de Conjuntos (Motorista + Cavalo + Carreta)
          </h1>
        </div>

        <button
          onClick={() => setModalAberto(true)}
          className="flex items-center gap-2 rounded-xl bg-signal-500 px-5 py-2.5 text-xs font-bold text-white shadow-glow transition-all hover:bg-signal-600"
        >
          <Plus className="size-4" /> Formar Novo Conjunto
        </button>
      </div>

      {/* Busca */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 size-4 text-ink-400" />
        <input
          type="text"
          placeholder="Buscar por motorista, placa do cavalo ou da carreta..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full rounded-xl border border-ink-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-ink-900 placeholder:text-ink-400 focus:outline-none"
        />
      </div>

      {/* Modal Formar Conjunto */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <h2 className="font-display text-xl font-bold uppercase text-ink-900 border-b border-ink-100 pb-3 flex items-center gap-2">
              <Layers className="size-5 text-brand-600" /> Formar Novo Conjunto Operacional
            </h2>

            <FormErrorAlert erro={erro} />

            <form onSubmit={handleSalvarConjunto} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-ink-700 uppercase">1. Selecionar Motorista *</label>
                <select
                  value={motoristaId}
                  onChange={(e) => setMotoristaId(e.target.value)}
                  required
                  className="mt-1 w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm font-bold text-ink-900"
                >
                  <option value="">Selecione o motorista...</option>
                  {motoristas.map((m) => (
                    <option key={m.id} value={m.id}>
                      👤 {m.nome} ({m.cpf})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-ink-700 uppercase">2. Selecionar Cavalo (Trator) *</label>
                <select
                  value={cavaloId}
                  onChange={(e) => setCavaloId(e.target.value)}
                  required
                  className="mt-1 w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm font-mono font-bold text-ink-900"
                >
                  <option value="">Selecione a placa do cavalo...</option>
                  {cavalos.map((v) => (
                    <option key={v.id} value={v.id}>
                      🚛 {v.placa} — {v.marca} {v.modelo}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-ink-700 uppercase">3. Selecionar Carreta (Reboque)</label>
                <select
                  value={carretaId}
                  onChange={(e) => setCarretaId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm font-mono font-bold text-ink-900"
                >
                  <option value="">Sem carreta (Somente Cavalo solto)</option>
                  {carretas.map((v) => (
                    <option key={v.id} value={v.id}>
                      📦 {v.placa} — {v.modelo} ({v.tipo_carreta || "Baú"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-ink-700 uppercase">Observações da Operação</label>
                <textarea
                  rows={2}
                  placeholder="Observações do vínculo de conjunto..."
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-ink-200 p-3"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-ink-100">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="rounded-xl border border-ink-200 px-4 py-2 font-bold text-ink-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-signal-500 px-6 py-2.5 font-bold text-white shadow-glow hover:bg-signal-600"
                >
                  {saving ? "Formando Conjunto..." : "Vincular & Salvar Conjunto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de Conjuntos */}
      <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
        {loading ? (
          <div className="py-12 text-center text-sm font-semibold text-ink-500">Carregando conjuntos...</div>
        ) : conjuntosFiltrados.length === 0 ? (
          <div className="py-12 text-center">
            <Layers className="mx-auto size-10 text-ink-300" />
            <p className="mt-2 text-sm font-semibold text-ink-600">Nenhum conjunto formado no momento.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-ink-100 bg-ink-50 text-ink-400 font-bold uppercase tracking-wider">
                  <th className="px-4 py-3">Motorista</th>
                  <th className="px-4 py-3">Cavalo (Trator)</th>
                  <th className="px-4 py-3">Carreta (Reboque)</th>
                  <th className="px-4 py-3">Data do Vínculo</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {conjuntosFiltrados.map((c) => (
                  <tr key={c.id} className="hover:bg-ink-50/50">
                    <td className="px-4 py-3.5 font-bold text-ink-900">
                      <span className="flex items-center gap-1.5 text-sm">
                        👤 {c.motorista?.nome || "Não informado"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-sm font-bold text-brand-900 bg-brand-50 border border-brand-200 px-2.5 py-1 rounded-lg">
                        🚛 {c.cavalo?.placa || "—"}
                      </span>
                      <span className="ml-2 text-ink-500 font-semibold">{c.cavalo?.marca} {c.cavalo?.modelo}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      {c.carreta?.placa ? (
                        <span className="font-mono text-sm font-bold text-purple-900 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-lg">
                          📦 {c.carreta.placa}
                        </span>
                      ) : (
                        <span className="text-ink-400 italic">Sem carreta</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-ink-500 font-semibold">
                      {c.data_inicio ? new Date(c.data_inicio).toLocaleDateString("pt-BR") : "—"}
                    </td>
                    <td className="px-4 py-3.5">
                      {c.ativo ? (
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-bold text-emerald-700 border border-emerald-200">
                          CONJUNTO ATIVO
                        </span>
                      ) : (
                        <span className="rounded-full bg-ink-100 px-2.5 py-1 font-bold text-ink-500">
                          Histórico
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => handleExcluirConjunto(c.id)}
                        className="rounded-lg p-1.5 text-ink-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Desvincular / Excluir Conjunto"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
