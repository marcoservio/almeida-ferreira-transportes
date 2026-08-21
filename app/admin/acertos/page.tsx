"use client";

import { useEffect, useState } from "react";
import {
  DollarSign,
  Plus,
  Calculator,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  Truck,
  Save,
  Printer,
  Trash2
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Motorista, Viagem } from "@/lib/supabase/types";

export default function AcertoViagemPage() {
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [viagens, setViagens] = useState<Viagem[]>([]);
  const [acertosHistorico, setAcertosHistorico] = useState<any[]>([]);

  const [motoristaId, setMotoristaId] = useState("");
  const [viagemId, setViagemId] = useState("");

  // Entradas do Fechamento
  const [adiantamento, setAdiantamento] = useState("0");
  const [abastecimentoAvista, setAbastecimentoAvista] = useState("0");
  const [abastecimentoAprazo, setAbastecimentoAprazo] = useState("0");
  const [descargaReembolso, setDescargaReembolso] = useState("0");
  const [descargaContaCliente, setDescargaContaCliente] = useState("0");
  const [vendaPallets, setVendaPallets] = useState("0");
  const [outrasDespesasAvista, setOutrasDespesasAvista] = useState("0");
  const [descontos, setDescontos] = useState("0");
  const [observacoes, setObservacoes] = useState("");

  const [saving, setSaving] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");

  const supabase = createClient();

  const [autocompletado, setAutocompletado] = useState(false);

  const carregarDados = async () => {
    const { data: mot } = await supabase.from("motoristas").select("*").eq("ativo", true);
    const { data: viag } = await supabase.from("viagens").select("*, motorista:motoristas(nome)").order("created_at", { ascending: false });
    const { data: acert } = await supabase.from("acertos_viagem").select("*, motorista:motoristas(nome), viagem:viagens(codigo_viagem)").order("created_at", { ascending: false });

    if (mot) setMotoristas(mot as Motorista[]);
    if (viag) setViagens(viag as unknown as Viagem[]);
    if (acert) setAcertosHistorico(acert);
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleExcluirAcerto = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este fechamento de acerto?")) {
      const { error } = await supabase.from("acertos_viagem").delete().eq("id", id);
      if (!error) {
        carregarDados();
      } else {
        setErro("Erro ao excluir acerto.");
      }
    }
  };

  const handleMotoristaAcertoChange = async (mId: string) => {
    setMotoristaId(mId);
    setAutocompletado(false);

    if (!mId) return;

    // Buscar a viagem ativa/recente deste motorista
    const { data: viag } = await supabase
      .from("viagens")
      .select("id")
      .eq("motorista_id", parseInt(mId))
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (viag) {
      setViagemId(viag.id.toString());
      setAutocompletado(true);
    }
  };

  // Cálculos Automáticos
  const numAdiantamento = parseFloat(adiantamento) || 0;
  const numAbastAvista = parseFloat(abastecimentoAvista) || 0;
  const numAbastAprazo = parseFloat(abastecimentoAprazo) || 0; // informativo (custo direto)
  const numDescargaReembolso = parseFloat(descargaReembolso) || 0;
  const numDescargaCliente = parseFloat(descargaContaCliente) || 0; // informativo (custo direto)
  const numPallets = parseFloat(vendaPallets) || 0;
  const numOutrasAvista = parseFloat(outrasDespesasAvista) || 0;
  const numDescontos = parseFloat(descontos) || 0;

  // Total Créditos do Motorista
  const totalReembolsosCreditos = numAdiantamento + numAbastAvista + numDescargaReembolso + numPallets + numOutrasAvista;
  // Saldo Líquido Final a Pagar ao Motorista
  const saldoFinal = totalReembolsosCreditos - numDescontos;

  const handleSalvarAcerto = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSucesso(false);
    setErro("");

    if (!viagemId || !motoristaId) {
      setErro("Selecione a viagem e o motorista para realizar o acerto.");
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("acertos_viagem").insert({
      viagem_id: parseInt(viagemId),
      motorista_id: parseInt(motoristaId),
      valor_adiantamento: numAdiantamento,
      valor_reembolso_abastecimento: numAbastAvista,
      valor_abastecimento_aprazo: numAbastAprazo,
      valor_reembolso_descarga: numDescargaReembolso,
      valor_descarga_conta_cliente: numDescargaCliente,
      valor_venda_pallets: numPallets,
      valor_outras_despesas_avista: numOutrasAvista,
      valor_descontos_diversos: numDescontos,
      saldo_final: saldoFinal,
      status_acerto: "APROVADO",
      observacoes,
    });

    if (error) {
      setErro(error.message);
    } else {
      setSucesso(true);
    }
    setSaving(false);
  };

  return (
    <div className="max-w-5xl space-y-8">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-signal-500">
            Módulo Financeiro Operacional
          </p>
          <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight text-ink-900">
            Acerto de Viagem com Motorista
          </h1>
          <p className="text-sm text-ink-500">
            Cálculo rápido automatizado com regras de reembolso à vista e custo direto a prazo.
          </p>
        </div>
      </div>

      {sucesso && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 flex items-center gap-3 text-emerald-900">
          <CheckCircle2 className="size-6 text-emerald-600 shrink-0" />
          <div>
            <h3 className="font-bold text-base">Acerto de Viagem Concluído com Sucesso!</h3>
            <p className="text-xs text-emerald-700">O fechamento financeiro foi registrado e salvo no histórico.</p>
          </div>
        </div>
      )}

      {erro && (
        <div className="rounded-2xl bg-signal-50 border border-signal-200 p-4 text-xs font-bold text-signal-700">
          {erro}
        </div>
      )}

      <form onSubmit={handleSalvarAcerto} className="grid gap-8 lg:grid-cols-3">
        {/* Formulário de Entradas (2 Colunas) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Seleção de Viagem e Motorista */}
          <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card space-y-4">
            <h2 className="font-display text-lg font-bold uppercase tracking-tight text-ink-900 border-b border-ink-100 pb-3">
              1. Identificação do Fechamento
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-700">
                  Viagem *
                </label>
                <select
                  value={viagemId}
                  onChange={(e) => {
                    setViagemId(e.target.value);
                    const v = viagens.find((item) => item.id.toString() === e.target.value);
                    if (v) setMotoristaId(v.motorista_id.toString());
                  }}
                  required
                  className="mt-1.5 w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm font-medium text-ink-900 focus:border-brand-600 focus:outline-none"
                >
                  <option value="">Selecione a viagem...</option>
                  {viagens.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.codigo_viagem} — {v.origem} → {v.destino} ({v.motorista?.nome})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-700">
                  Motorista *
                </label>
                <select
                  value={motoristaId}
                  onChange={(e) => handleMotoristaAcertoChange(e.target.value)}
                  required
                  className="mt-1.5 w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm font-medium text-ink-900 focus:border-brand-600 focus:outline-none"
                >
                  <option value="">Selecione o motorista...</option>
                  {motoristas.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nome} ({m.cpf})
                    </option>
                  ))}
                </select>

              </div>
            </div>
          </div>

          {/* Lançamento de Valores Reembolsáveis vs Custo Direto */}
          <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card space-y-6">
            <h2 className="font-display text-lg font-bold uppercase tracking-tight text-ink-900 border-b border-ink-100 pb-3">
              2. Lançamento de Despesas e Reembolsos
            </h2>

            {/* Abastecimentos */}
            <div className="grid gap-4 sm:grid-cols-2 bg-ink-50/70 p-4 rounded-xl border border-ink-100">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Abastecimento À VISTA (Reembolso Motorista) R$
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={abastecimentoAvista}
                  onChange={(e) => setAbastecimentoAvista(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-emerald-300 bg-white px-3.5 py-2 text-sm font-bold text-ink-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-600">
                  Abastecimento A PRAZO (Custo Direto Empresa) R$
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={abastecimentoAprazo}
                  onChange={(e) => setAbastecimentoAprazo(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2 text-sm font-medium text-ink-600 focus:outline-none"
                />
                <p className="text-[10px] text-ink-400 mt-1">Empresa paga direto ao posto (R$ 0 reembolso)</p>
              </div>
            </div>

            {/* Descargas */}
            <div className="grid gap-4 sm:grid-cols-2 bg-ink-50/70 p-4 rounded-xl border border-ink-100">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-800">
                  DES. DESCARGA (Reembolso Motorista) R$
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={descargaReembolso}
                  onChange={(e) => setDescargaReembolso(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-emerald-300 bg-white px-3.5 py-2 text-sm font-bold text-ink-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-600">
                  DESCARGA CONTA CLIENTE (Custo Empresa) R$
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={descargaContaCliente}
                  onChange={(e) => setDescargaContaCliente(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2 text-sm font-medium text-ink-600 focus:outline-none"
                />
                <p className="text-[10px] text-ink-400 mt-1">Empresa acertou direto (R$ 0 reembolso)</p>
              </div>
            </div>

            {/* Pallets e Outras Despesas */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Adiantamento Pago R$
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={adiantamento}
                  onChange={(e) => setAdiantamento(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2 text-sm font-bold text-ink-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Venda de Pallets R$
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={vendaPallets}
                  onChange={(e) => setVendaPallets(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2 text-sm font-bold text-ink-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Outras Despesas À Vista R$
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={outrasDespesasAvista}
                  onChange={(e) => setOutrasDespesasAvista(e.target.value)}
                  placeholder="Chapa/Borracharia..."
                  className="mt-1.5 w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2 text-sm font-bold text-ink-900 focus:outline-none"
                />
              </div>
            </div>

            {/* Descontos Diversos */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-signal-600">
                Descontos Diversos (-) R$
              </label>
              <input
                type="number"
                step="0.01"
                value={descontos}
                onChange={(e) => setDescontos(e.target.value)}
                className="mt-1.5 w-full max-w-xs rounded-xl border border-signal-300 bg-white px-3.5 py-2 text-sm font-bold text-signal-700 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Resumo do Saldo Líquido (Coluna Direita Fixa) */}
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-2xl border border-ink-900 bg-ink-950 p-6 text-white shadow-card sticky top-28 space-y-6">
            <h2 className="font-display text-lg font-bold uppercase tracking-wide text-signal-500 border-b border-ink-800 pb-3">
              Resumo do Fechamento
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-ink-300">
                <span>Adiantamento:</span>
                <span className="font-mono font-bold text-white">R$ {numAdiantamento.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-ink-300">
                <span>Abast. À Vista:</span>
                <span className="font-mono font-bold text-emerald-400">R$ {numAbastAvista.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-ink-300">
                <span>Descarga Reembolso:</span>
                <span className="font-mono font-bold text-emerald-400">R$ {numDescargaReembolso.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-ink-300">
                <span>Venda Pallets:</span>
                <span className="font-mono font-bold text-emerald-400">R$ {numPallets.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-ink-300">
                <span>Outras Despesas À Vista:</span>
                <span className="font-mono font-bold text-emerald-400">R$ {numOutrasAvista.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-ink-300 pt-2 border-t border-ink-800">
                <span>Descontos:</span>
                <span className="font-mono font-bold text-signal-400">- R$ {numDescontos.toFixed(2)}</span>
              </div>
            </div>

            {/* Saldo Final Destacado */}
            <div className="rounded-xl bg-ink-900 p-4 border border-ink-800 text-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-ink-400">
                Saldo a Pagar ao Motorista
              </span>
              <p className="font-display text-3xl font-black text-signal-500 mt-1">
                R$ {saldoFinal.toFixed(2)}
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-signal-500 px-6 py-3.5 text-sm font-bold text-white shadow-glow transition-all hover:bg-signal-600 disabled:opacity-50"
            >
              <Save className="size-4" />
              {saving ? "Registrando Acerto..." : "Aprovar & Salvar Acerto"}
            </button>
          </div>
        </div>
      </form>

      {/* Histórico de Acertos Salvos */}
      <div className="mt-8 rounded-2xl border border-ink-100 bg-white p-6 shadow-card space-y-4">
        <h2 className="font-display text-lg font-bold uppercase tracking-tight text-ink-900 border-b border-ink-100 pb-3 flex items-center gap-2">
          <FileSpreadsheet className="size-5 text-signal-500" /> Histórico de Acertos Salvos
        </h2>

        {acertosHistorico.length === 0 ? (
          <p className="text-center py-6 text-xs text-ink-400 font-semibold">Nenhum fechamento de acerto registrado no sistema.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-ink-100 bg-ink-50 text-ink-400 font-bold uppercase tracking-wider">
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Motorista</th>
                  <th className="px-4 py-3">Viagem</th>
                  <th className="px-4 py-3">Adiantamento</th>
                  <th className="px-4 py-3">Saldo Final</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {acertosHistorico.map((a) => (
                  <tr key={a.id} className="hover:bg-ink-50/50">
                    <td className="px-4 py-3 font-semibold text-ink-600">
                      {new Date(a.created_at).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-3 font-bold text-ink-900">
                      👤 {a.motorista?.nome || "—"}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-brand-900">
                      {a.viagem?.codigo_viagem || `#${a.viagem_id}`}
                    </td>
                    <td className="px-4 py-3 font-mono text-ink-700">
                      R$ {parseFloat(a.adiantamento || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-emerald-700">
                      R$ {parseFloat(a.saldo_final || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleExcluirAcerto(a.id)}
                        className="rounded-lg p-1.5 text-ink-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Excluir Fechamento de Acerto"
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
