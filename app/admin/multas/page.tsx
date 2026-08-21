"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, Plus, Truck, UserCheck, Calendar, DollarSign, RefreshCw, CheckCircle2, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Multa, Veiculo, Motorista } from "@/lib/supabase/types";
import { formatarErroBanco } from "@/lib/db-errors";
import { FormErrorAlert } from "@/components/admin/form-error-alert";

export default function MultasPage() {
  const [multas, setMultas] = useState<Multa[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);

  const [veiculoId, setVeiculoId] = useState("");
  const [motoristaId, setMotoristaId] = useState("");
  const [autoInfracao, setAutoInfracao] = useState("");
  const [dataInfracao, setDataInfracao] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [pontos, setPontos] = useState("4");
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  const carregarMultas = async () => {
    setLoading(true);
    const { data: mData } = await supabase
      .from("multas")
      .select("*, veiculo:veiculos(placa), motorista:motoristas(nome)")
      .order("data_infracao", { ascending: false });

    const { data: vData } = await supabase.from("veiculos").select("*").eq("ativo", true);
    const { data: motData } = await supabase.from("motoristas").select("*").eq("ativo", true);

    if (mData) setMultas(mData as unknown as Multa[]);
    if (vData) setVeiculos(vData as Veiculo[]);
    if (motData) setMotoristas(motData as Motorista[]);
    setLoading(false);
  };

  useEffect(() => {
    carregarMultas();
  }, []);

  const handleExcluirMulta = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta multa de trânsito?")) {
      const { error } = await supabase.from("multas").delete().eq("id", id);
      if (!error) {
        carregarMultas();
      } else {
        setErro(formatarErroBanco(error));
      }
    }
  };

  const [erro, setErro] = useState("");

  const handleSalvarMulta = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErro("");

    const { error } = await supabase.from("multas").insert({
      veiculo_id: parseInt(veiculoId),
      motorista_id: motoristaId ? parseInt(motoristaId) : null,
      auto_infracao: autoInfracao.toUpperCase(),
      data_infracao: dataInfracao,
      descricao,
      valor: parseFloat(valor),
      pontos: parseInt(pontos) || 0,
      status: "PENDENTE",
    });

    if (error) {
      setErro(formatarErroBanco(error));
    } else {
      setModalAberto(false);
      setAutoInfracao("");
      setDescricao("");
      setValor("");
      carregarMultas();
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-signal-500">
            Controle de Infração & Pontuação
          </p>
          <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight text-ink-900">
            Multas de Trânsito
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setModalAberto(true)}
            className="flex items-center gap-2 rounded-xl bg-signal-500 px-5 py-2.5 text-xs font-bold text-white shadow-glow transition-all hover:bg-signal-600"
          >
            <Plus className="size-4" /> Registrar Multa
          </button>
        </div>
      </div>

      {/* Modal */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <h2 className="font-display text-xl font-bold uppercase text-ink-900 border-b border-ink-100 pb-3">
              Registrar Auto de Infração
            </h2>

            <FormErrorAlert erro={erro} />

            <form onSubmit={handleSalvarMulta} className="space-y-4">
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
                  <label className="block text-xs font-bold uppercase text-ink-700">Condutor Indicado</label>
                  <select
                    value={motoristaId}
                    onChange={(e) => setMotoristaId(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-ink-200 px-3.5 py-2 text-sm"
                  >
                    <option value="">A identificar / Empresa</option>
                    {motoristas.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase text-ink-700">Auto de Infração *</label>
                  <input
                    type="text"
                    placeholder="EX: A00293849"
                    value={autoInfracao}
                    onChange={(e) => setAutoInfracao(e.target.value)}
                    required
                    className="mt-1 w-full rounded-xl border border-ink-200 px-3.5 py-2 text-sm font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-ink-700">Data da Infração *</label>
                  <input
                    type="date"
                    value={dataInfracao}
                    onChange={(e) => setDataInfracao(e.target.value)}
                    required
                    className="mt-1 w-full rounded-xl border border-ink-200 px-3.5 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-ink-700">Descrição do Enquadramento *</label>
                <input
                  type="text"
                  placeholder="Ex: Excesso de velocidade até 20%"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  required
                  className="mt-1 w-full rounded-xl border border-ink-200 px-3.5 py-2 text-sm"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase text-ink-700">Valor R$ *</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="195.23"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    required
                    className="mt-1 w-full rounded-xl border border-ink-200 px-3.5 py-2 text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-ink-700">Pontos CNH</label>
                  <input
                    type="number"
                    value={pontos}
                    onChange={(e) => setPontos(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-ink-200 px-3.5 py-2 text-sm font-bold"
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
                  {saving ? "Salvando..." : "Salvar Multa"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabela */}
      <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
        {loading ? (
          <div className="py-12 text-center text-sm font-semibold text-ink-500">Carregando multas...</div>
        ) : multas.length === 0 ? (
          <div className="py-12 text-center">
            <ShieldAlert className="mx-auto size-10 text-ink-300" />
            <p className="mt-2 text-sm font-semibold text-ink-600">Nenhuma multa cadastrada.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-ink-100 bg-ink-50 text-ink-400 font-bold uppercase tracking-wider">
                  <th className="px-4 py-3">Auto / Data</th>
                  <th className="px-4 py-3">Veículo / Motorista</th>
                  <th className="px-4 py-3">Infração</th>
                  <th className="px-4 py-3">Pontos</th>
                  <th className="px-4 py-3">Valor Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {multas.map((m) => (
                  <tr key={m.id} className="hover:bg-ink-50/50">
                    <td className="px-4 py-3.5">
                      <p className="font-mono font-bold text-ink-900">{m.auto_infracao}</p>
                      <p className="text-ink-500 text-[11px]">{new Date(m.data_infracao).toLocaleDateString("pt-BR")}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-mono font-bold text-ink-900">{m.veiculo?.placa}</p>
                      <p className="text-ink-600 text-[11px]">{m.motorista?.nome || "Empresa"}</p>
                    </td>
                    <td className="px-4 py-3.5 text-ink-700">
                      {m.descricao}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-amber-700">
                      {m.pontos} pts
                    </td>
                    <td className="px-4 py-3.5 font-mono font-bold text-ink-900 text-sm">
                      R$ {Number(m.valor).toFixed(2)}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-800 border border-amber-200">
                        {m.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => handleExcluirMulta(m.id)}
                        className="rounded-lg p-1.5 text-ink-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Excluir Multa"
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
