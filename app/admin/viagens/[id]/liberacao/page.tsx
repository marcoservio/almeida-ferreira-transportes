"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  FileText, 
  Truck, 
  Send, 
  ShieldCheck, 
  Mail, 
  Camera, 
  Save,
  CheckSquare
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Viagem, ViagemLiberacaoChecklist } from "@/lib/supabase/types";

export default function LiberacaoViagemPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const viagemId = parseInt(resolvedParams.id);

  const [viagem, setViagem] = useState<Viagem | null>(null);
  const [checklist, setChecklist] = useState<ViagemLiberacaoChecklist | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [smCodigo, setSmCodigo] = useState("");

  const supabase = createClient();

  const carregarDados = async () => {
    setLoading(true);
    const { data: vData } = await supabase
      .from("viagens")
      .select("*, motorista:motoristas(nome, telefone), cavalo:veiculos(placa)")
      .eq("id", viagemId)
      .single();

    if (vData) {
      setViagem(vData as unknown as Viagem);
    }

    const { data: cData } = await supabase
      .from("viagem_liberacao_checklist")
      .select("*")
      .eq("viagem_id", viagemId)
      .maybeSingle();

    if (cData) {
      setChecklist(cData as ViagemLiberacaoChecklist);
      setSmCodigo(cData.sm_krona_codigo || "");
    } else {
      // Se não existir, cria o checklist zerado
      const { data: newChecklist } = await supabase
        .from("viagem_liberacao_checklist")
        .insert({ viagem_id: viagemId })
        .select()
        .single();
      if (newChecklist) setChecklist(newChecklist as ViagemLiberacaoChecklist);
    }
    setLoading(false);
  };

  useEffect(() => {
    carregarDados();
  }, [viagemId]);

  const toggleStep = async (field: keyof ViagemLiberacaoChecklist) => {
    if (!checklist) return;
    setSaving(true);

    const novoValor = !checklist[field];
    const { error } = await supabase
      .from("viagem_liberacao_checklist")
      .update({
        [field]: novoValor,
        sm_krona_codigo: smCodigo,
        updated_at: new Date().toISOString(),
      })
      .eq("id", checklist.id);

    if (!error) {
      setChecklist({ ...checklist, [field]: novoValor, sm_krona_codigo: smCodigo });
    }
    setSaving(false);
  };

  const salvarSmCodigo = async () => {
    if (!checklist) return;
    setSaving(true);
    await supabase
      .from("viagem_liberacao_checklist")
      .update({ sm_krona_codigo: smCodigo })
      .eq("id", checklist.id);
    setSaving(false);
  };

  if (loading || !viagem || !checklist) {
    return <div className="py-20 text-center text-sm font-semibold text-ink-500">Carregando formulário de liberação...</div>;
  }

  const passos = [
    { key: "step_cte_emitido", title: "1. Emissão de CTE", desc: "Verificar se os CTEs da viagem foram totalmente emitidos no Bsoft." },
    { key: "step_ciot_gerado", title: "2. Geração do CIOT", desc: "Gerar e vincular o código CIOT exigido pela ANTT." },
    { key: "step_ciot_manifesto_sefaz", title: "3. Manifesto & SEFAZ", desc: "Informar o CIOT no manifesto e transmitir para a SEFAZ baixar o DACTE/DAMDFE." },
    { key: "step_xml_cte_impresso", title: "4. Impressão dos XMLs", desc: "Acessar o conhecimento e imprimir os arquivos XML dos CTEs." },
    { key: "step_espelhamento_rastreio", title: "5. Espelhamento do Rastreio", desc: "Configurar o espelhamento de sinal da gerenciadora de risco/rastreador." },
    { key: "step_rota_krona_criada", title: "6. Criação da Rota Krona", desc: "Cadastrar a rota aprovada no portal da gerenciadora Krona." },
    { key: "step_sm_krona_criada", title: "7. Criação da SM Krona", desc: "Gerar a Solicitação de Monitoramento (SM) na Krona." },
    { key: "step_foto_motorista_sm_enviada", title: "8. Foto da SM ao Motorista", desc: "Enviar a foto/comprovante da SM criada diretamente no WhatsApp do motorista." },
    { key: "step_email_ctes_dacte_enviado", title: "9. E-mail com CTEs e DACTE", desc: "Enviar e-mail padronizado ao cliente contendo os CTEs e DACTE/DAMDFE." },
  ];

  const totalConcluidos = passos.filter((p) => checklist[p.key as keyof ViagemLiberacaoChecklist]).length;
  const percentual = Math.round((totalConcluidos / 9) * 100);

  return (
    <div className="max-w-4xl space-y-6">
      {/* Voltar */}
      <Link
        href="/admin/viagens"
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-500 hover:text-ink-900"
      >
        <ArrowLeft className="size-4" /> Voltar para o Quadro de Viagens
      </Link>

      {/* Cartão de Resumo da Viagem */}
      <div className="rounded-2xl border border-ink-100 bg-ink-950 p-6 text-white shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink-800 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-signal-500">
              Liberação Operacional de Viagem
            </span>
            <h1 className="font-display text-2xl font-black uppercase text-white">
              Viagem {viagem.codigo_viagem}
            </h1>
            <p className="text-sm font-semibold text-ink-300">
              {viagem.origem} → {viagem.destino}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-ink-400 font-medium">Progresso da Liberação</span>
            <p className="font-display text-3xl font-black text-signal-500">{percentual}%</p>
            <p className="text-xs text-ink-400 font-bold">{totalConcluidos} de 9 passos concluídos</p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 text-xs text-ink-300">
          <p>👤 <strong className="text-white">Motorista:</strong> {viagem.motorista?.nome || "Não atribuído"}</p>
          <p>🚛 <strong className="text-white">Placa Trator:</strong> {viagem.cavalo?.placa || "Não informado"}</p>
        </div>
      </div>

      {/* Campo Código SM Krona */}
      <div className="rounded-2xl border border-brand-200 bg-brand-50 p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-sm font-bold uppercase text-brand-900">
            Código da SM Krona
          </h3>
          <p className="text-xs text-brand-700">Informe o número da SM gerada para vinculação</p>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ex: SM-849204"
            value={smCodigo}
            onChange={(e) => setSmCodigo(e.target.value)}
            className="rounded-xl border border-brand-300 bg-white px-3.5 py-2 text-sm font-mono font-bold text-ink-900 focus:outline-none"
          />
          <button
            onClick={salvarSmCodigo}
            disabled={saving}
            className="flex items-center gap-1 rounded-xl bg-brand-700 px-4 py-2 text-xs font-bold text-white hover:bg-brand-800"
          >
            <Save className="size-3.5" /> Salvar SM
          </button>
        </div>
      </div>

      {/* Lista dos 9 Passos */}
      <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card space-y-4">
        <h2 className="font-display text-lg font-bold uppercase tracking-tight text-ink-900 border-b border-ink-100 pb-3">
          Checklist Padronizado de Liberação (9 Etapas)
        </h2>

        <div className="divide-y divide-ink-100">
          {passos.map((p) => {
            const checked = Boolean(checklist[p.key as keyof ViagemLiberacaoChecklist]);

            return (
              <div
                key={p.key}
                onClick={() => toggleStep(p.key as keyof ViagemLiberacaoChecklist)}
                className={`flex items-start gap-4 py-4 px-3 rounded-xl cursor-pointer transition-colors ${
                  checked ? "bg-emerald-50/60" : "hover:bg-ink-50"
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {checked ? (
                    <CheckCircle2 className="size-6 text-emerald-600" />
                  ) : (
                    <Circle className="size-6 text-ink-300" />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className={`text-sm font-bold ${checked ? "text-emerald-950 line-through" : "text-ink-900"}`}>
                    {p.title}
                  </h3>
                  <p className="text-xs text-ink-500 mt-0.5">{p.desc}</p>
                </div>

                <span
                  className={`rounded-lg px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
                    checked
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-ink-100 text-ink-600"
                  }`}
                >
                  {checked ? "Concluído" : "Pendente"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
