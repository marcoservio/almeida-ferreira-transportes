"use client";

import { useEffect, useState } from "react";
import { Wrench, Plus, Truck, Calendar, DollarSign, Search, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Manutencao, Veiculo } from "@/lib/supabase/types";
import { formatarErroBanco } from "@/lib/db-errors";
import { FormErrorAlert } from "@/components/admin/form-error-alert";

export default function ManutencoesPage() {
  const [manutencoes, setManutencoes] = useState<Manutencao[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);

  const [veiculoId, setVeiculoId] = useState("");
  const [tipoManutencao, setTipoManutencao] = useState("Preventiva");
  const [descricao, setDescricao] = useState("");
  const [oficina, setOficina] = useState("");
  const [km, setKm] = useState("");
  const [valorTotal, setValorTotal] = useState("");
  const [dataManutencao, setDataManutencao] = useState("");
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  const carregarManutencoes = async () => {
    setLoading(true);
    const { data: mData } = await supabase
      .from("manutencoes")
      .select("*, veiculo:veiculos(placa, modelo)")
      .order("data_manutencao", { ascending: false });

    const { data: vData } = await supabase.from("veiculos").select("*").eq("ativo", true);

    if (mData) setManutencoes(mData as unknown as Manutencao[]);
    if (vData) setVeiculos(vData as Veiculo[]);
    setLoading(false);
  };

  useEffect(() => {
    carregarManutencoes();
  }, []);

  const [erro, setErro] = useState("");

  const handleExcluirManutencao = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta manutenção?")) {
      const { error } = await supabase.from("manutencoes").delete().eq("id", id);
      if (!error) {
        carregarManutencoes();
      } else {
        setErro(formatarErroBanco(error));
      }
    }
  };

  const handleSalvarManutencao = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErro("");

    const { error } = await supabase.from("manutencoes").insert({
      veiculo_id: parseInt(veiculoId),
      tipo_manutencao: tipoManutencao,
      descricao,
      oficina_local: oficina || null,
      hodometro_km: parseInt(km),
      valor_total: parseFloat(valorTotal),
      data_manutencao: dataManutencao,
    });

    if (error) {
      setErro(formatarErroBanco(error));
    } else {
      setModalAberto(false);
      setDescricao("");
      setOficina("");
      setValorTotal("");
      carregarManutencoes();
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-signal-500">
            Manutenção de Frota
          </p>
          <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight text-ink-900">
            Manutenções Preventivas e Corretivas
          </h1>
        </div>

        <button
          onClick={() => setModalAberto(true)}
          className="flex items-center gap-2 rounded-xl bg-signal-500 px-5 py-2.5 text-xs font-bold text-white shadow-glow transition-all hover:bg-signal-600"
        >
          <Plus className="size-4" /> Registrar Manutenção
        </button>
      </div>

      {/* Modal */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <h2 className="font-display text-xl font-bold uppercase text-ink-900 border-b border-ink-100 pb-3">
              Registrar Nova Manutenção
            </h2>

            <FormErrorAlert erro={erro} />

            <form onSubmit={handleSalvarManutencao} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase text-ink-700">Veículo *</label>
                  <select
                    value={veiculoId}
                    onChange={(e) => setVeiculoId(e.target.value)}
                    required
                    className="mt-1 w-full rounded-xl border border-ink-200 px-3.5 py-2 text-sm"
                  >
                    <option value="">Selecione o veículo...</option>
                    {veiculos.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.placa} ({v.modelo})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-ink-700">Tipo de Manutenção *</label>
                  <select
                    value={tipoManutencao}
                    onChange={(e) => setTipoManutencao(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-ink-200 px-3.5 py-2 text-sm font-bold"
                  >
                    <option value="Preventiva">Preventiva</option>
                    <option value="Corretiva">Corretiva</option>
                    <option value="Troca de Óleo / Filtros">Troca de Óleo / Filtros</option>
                    <option value="Pneus / Alinhamento">Pneus / Alinhamento</option>
                    <option value="Freios / Suspensão">Freios / Suspensão</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-ink-700">Descrição do Serviço *</label>
                <textarea
                  placeholder="Descreva as peças trocadas e reparos executados..."
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  required
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-ink-200 p-3 text-sm"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-ink-700">Oficina / Local</label>
                  <input
                    type="text"
                    placeholder="Oficina Mecânica X"
                    value={oficina}
                    onChange={(e) => setOficina(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-ink-200 px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-ink-700">KM Atual *</label>
                  <input
                    type="number"
                    placeholder="340500"
                    value={km}
                    onChange={(e) => setKm(e.target.value)}
                    required
                    className="mt-1 w-full rounded-xl border border-ink-200 px-3 py-2 text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-ink-700">Valor Total R$ *</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="1250.00"
                    value={valorTotal}
                    onChange={(e) => setValorTotal(e.target.value)}
                    required
                    className="mt-1 w-full rounded-xl border border-ink-200 px-3 py-2 text-sm font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-ink-100">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="rounded-xl border border-ink-200 px-4 py-2 text-xs font-bold text-ink-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-signal-500 px-5 py-2 text-xs font-bold text-white shadow-glow"
                >
                  {saving ? "Salvando..." : "Salvar Manutenção"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabela */}
      <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
        {loading ? (
          <div className="py-12 text-center text-sm font-semibold text-ink-500">Carregando manutenções...</div>
        ) : manutencoes.length === 0 ? (
          <div className="py-12 text-center">
            <Wrench className="mx-auto size-10 text-ink-300" />
            <p className="mt-2 text-sm font-semibold text-ink-600">Nenhuma manutenção registrada.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-ink-100 bg-ink-50 text-ink-400 font-bold uppercase tracking-wider">
                  <th className="px-4 py-3">Data / Veículo</th>
                  <th className="px-4 py-3">Tipo / Descrição</th>
                  <th className="px-4 py-3">Oficina / Local</th>
                  <th className="px-4 py-3">KM Hodômetro</th>
                  <th className="px-4 py-3">Valor Total</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {manutencoes.map((m) => (
                  <tr key={m.id} className="hover:bg-ink-50/50">
                    <td className="px-4 py-3.5">
                      <p className="font-mono font-bold text-ink-900">{m.veiculo?.placa}</p>
                      <p className="text-ink-500 text-[11px]">{new Date(m.data_manutencao).toLocaleDateString("pt-BR")}</p>
                    </td>
                    <td className="px-4 py-3.5 max-w-xs">
                      <span className="font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                        {m.tipo_manutencao}
                      </span>
                      <p className="text-ink-600 mt-1 text-[11px] line-clamp-2">{m.descricao}</p>
                    </td>
                    <td className="px-4 py-3.5 text-ink-700">
                      {m.oficina_local || "—"}
                    </td>
                    <td className="px-4 py-3.5 font-mono font-semibold text-ink-800">
                      {m.hodometro_km} km
                    </td>
                    <td className="px-4 py-3.5 font-mono font-bold text-ink-900 text-sm">
                      R$ {Number(m.valor_total).toFixed(2)}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => handleExcluirManutencao(m.id)}
                        className="rounded-lg p-1.5 text-ink-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Excluir Manutenção"
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
