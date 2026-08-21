"use client";

import { useEffect, useState } from "react";
import { Fuel, Plus, Truck, Building2, Calendar, DollarSign, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Abastecimento, Veiculo, Motorista, PostoCombustivel, TipoPagamento } from "@/lib/supabase/types";
import { formatarErroBanco } from "@/lib/db-errors";
import { FormErrorAlert } from "@/components/admin/form-error-alert";

export default function AbastecimentosPage() {
  const [abastecimentos, setAbastecimentos] = useState<Abastecimento[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [postos, setPostos] = useState<PostoCombustivel[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);

  // Form State
  const [veiculoId, setVeiculoId] = useState("");
  const [motoristaId, setMotoristaId] = useState("");
  const [postoId, setPostoId] = useState("");
  const [km, setKm] = useState("");
  const [litros, setLitros] = useState("");
  const [valorLitro, setValorLitro] = useState("");
  const [tipoPagamento, setTipoPagamento] = useState<TipoPagamento>("A_PRAZO");
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  const carregarDados = async () => {
    setLoading(true);
    const { data: abastData } = await supabase
      .from("abastecimentos")
      .select("*, veiculo:veiculos(placa, modelo), motorista:motoristas(nome), posto:postos_combustivel(nome_fantasia)")
      .order("data_abastecimento", { ascending: false });

    const { data: vData } = await supabase.from("veiculos").select("*").eq("ativo", true);
    const { data: mData } = await supabase.from("motoristas").select("*").eq("ativo", true);
    const { data: pData } = await supabase.from("postos_combustivel").select("*");

    if (abastData) setAbastecimentos(abastData as unknown as Abastecimento[]);
    if (vData) setVeiculos(vData as Veiculo[]);
    if (mData) setMotoristas(mData as Motorista[]);
    if (pData) setPostos(pData as PostoCombustivel[]);
    setLoading(false);
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleExcluirAbastecimento = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este abastecimento?")) {
      const { error } = await supabase.from("abastecimentos").delete().eq("id", id);
      if (!error) {
        carregarDados();
      } else {
        setErro(formatarErroBanco(error));
      }
    }
  };

  const [erro, setErro] = useState("");

  const numLitros = parseFloat(litros) || 0;
  const numValorLitro = parseFloat(valorLitro) || 0;
  const valorTotalCalculado = numLitros * numValorLitro;

  const handleSalvarAbastecimento = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErro("");

    const { error } = await supabase.from("abastecimentos").insert({
      veiculo_id: parseInt(veiculoId),
      motorista_id: parseInt(motoristaId),
      posto_id: parseInt(postoId),
      hodometro_km: parseInt(km),
      litros: numLitros,
      valor_litro: numValorLitro,
      valor_total: valorTotalCalculado,
      tipo_pagamento: tipoPagamento,
    });

    if (error) {
      setErro(formatarErroBanco(error));
    } else {
      setModalAberto(false);
      setKm("");
      setLitros("");
      setValorLitro("");
      carregarDados();
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-signal-500">
            Controle de Combustível
          </p>
          <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight text-ink-900">
            Abastecimentos de Veículos
          </h1>
        </div>

        <button
          onClick={() => setModalAberto(true)}
          className="flex items-center gap-2 rounded-xl bg-signal-500 px-5 py-2.5 text-xs font-bold text-white shadow-glow transition-all hover:bg-signal-600"
        >
          <Plus className="size-4" /> Lançar Abastecimento
        </button>
      </div>

      {/* Modal */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <h2 className="font-display text-xl font-bold uppercase text-ink-900 border-b border-ink-100 pb-3">
              Novo Lançamento de Abastecimento
            </h2>

            <FormErrorAlert erro={erro} />

            <form onSubmit={handleSalvarAbastecimento} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase text-ink-700">Veículo *</label>
                  <select
                    value={veiculoId}
                    onChange={(e) => setVeiculoId(e.target.value)}
                    required
                    className="mt-1 w-full rounded-xl border border-ink-200 px-3.5 py-2 text-sm"
                  >
                    <option value="">Selecione...</option>
                    {veiculos.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.placa} ({v.modelo})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-ink-700">Motorista *</label>
                  <select
                    value={motoristaId}
                    onChange={(e) => setMotoristaId(e.target.value)}
                    required
                    className="mt-1 w-full rounded-xl border border-ink-200 px-3.5 py-2 text-sm"
                  >
                    <option value="">Selecione...</option>
                    {motoristas.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-ink-700">Posto Parceiro *</label>
                <select
                  value={postoId}
                  onChange={(e) => setPostoId(e.target.value)}
                  required
                  className="mt-1 w-full rounded-xl border border-ink-200 px-3.5 py-2 text-sm"
                >
                  <option value="">Selecione o posto...</option>
                  {postos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome_fantasia} ({p.cidade}/{p.uf})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-ink-700">Hodômetro KM *</label>
                  <input
                    type="number"
                    value={km}
                    onChange={(e) => setKm(e.target.value)}
                    required
                    className="mt-1 w-full rounded-xl border border-ink-200 px-3 py-2 text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-ink-700">Litros *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={litros}
                    onChange={(e) => setLitros(e.target.value)}
                    required
                    className="mt-1 w-full rounded-xl border border-ink-200 px-3 py-2 text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-ink-700">Valor / Litro R$ *</label>
                  <input
                    type="number"
                    step="0.001"
                    value={valorLitro}
                    onChange={(e) => setValorLitro(e.target.value)}
                    required
                    className="mt-1 w-full rounded-xl border border-ink-200 px-3 py-2 text-sm font-bold"
                  />
                </div>
              </div>

              <div className="rounded-xl bg-ink-50 p-3 flex justify-between items-center text-xs border border-ink-100">
                <span className="font-bold uppercase text-ink-600">Valor Total Calculado:</span>
                <span className="font-mono text-base font-black text-ink-900">
                  R$ {valorTotalCalculado.toFixed(2)}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-ink-700">Tipo de Pagamento *</label>
                <div className="mt-1.5 flex gap-4">
                  <label className="flex items-center gap-2 text-xs font-semibold text-ink-800">
                    <input
                      type="radio"
                      name="tipoPagamento"
                      value="A_PRAZO"
                      checked={tipoPagamento === "A_PRAZO"}
                      onChange={() => setTipoPagamento("A_PRAZO")}
                    />
                    A Prazo (Faturado Empresa)
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                    <input
                      type="radio"
                      name="tipoPagamento"
                      value="A_VISTA"
                      checked={tipoPagamento === "A_VISTA"}
                      onChange={() => setTipoPagamento("A_VISTA")}
                    />
                    À Vista (Reembolso Motorista)
                  </label>
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
                  {saving ? "Salvando..." : "Salvar Lançamento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabela */}
      <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
        {loading ? (
          <div className="py-12 text-center text-sm font-semibold text-ink-500">Carregando histórico...</div>
        ) : abastecimentos.length === 0 ? (
          <div className="py-12 text-center">
            <Fuel className="mx-auto size-10 text-ink-300" />
            <p className="mt-2 text-sm font-semibold text-ink-600">Nenhum abastecimento registrado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-ink-100 bg-ink-50 text-ink-400 font-bold uppercase tracking-wider">
                  <th className="px-4 py-3">Data / Veículo</th>
                  <th className="px-4 py-3">Motorista</th>
                  <th className="px-4 py-3">Posto</th>
                  <th className="px-4 py-3">Litros / Vlr Litro</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Tipo Pagamento</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {abastecimentos.map((a) => (
                  <tr key={a.id} className="hover:bg-ink-50/50">
                    <td className="px-4 py-3.5">
                      <p className="font-mono font-bold text-ink-900">{a.veiculo?.placa}</p>
                      <p className="text-ink-500 text-[11px]">{new Date(a.data_abastecimento).toLocaleDateString("pt-BR")}</p>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-ink-800">
                      {a.motorista?.nome || "—"}
                    </td>
                    <td className="px-4 py-3.5 text-ink-700">
                      {a.posto?.nome_fantasia || "—"}
                    </td>
                    <td className="px-4 py-3.5 font-mono">
                      {a.litros} L × R$ {Number(a.valor_litro).toFixed(3)}
                    </td>
                    <td className="px-4 py-3.5 font-mono font-bold text-ink-900 text-sm">
                      R$ {Number(a.valor_total).toFixed(2)}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border ${
                          a.tipo_pagamento === "A_VISTA"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : "bg-ink-100 text-ink-700 border-ink-200"
                        }`}
                      >
                        {a.tipo_pagamento === "A_VISTA" ? "À Vista (Reembolso)" : "A Prazo (Empresa)"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => handleExcluirAbastecimento(a.id)}
                        className="rounded-lg p-1.5 text-ink-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Excluir Abastecimento"
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
