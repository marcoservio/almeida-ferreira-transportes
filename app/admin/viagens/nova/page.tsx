"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Truck, MapPin, Package, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Motorista, Veiculo } from "@/lib/supabase/types";
import { formatarErroBanco } from "@/lib/db-errors";
import { FormErrorAlert } from "@/components/admin/form-error-alert";

export default function NovaViagemPage() {
  const router = useRouter();
  const supabase = createClient();

  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [cavalos, setCavalos] = useState<Veiculo[]>([]);
  const [carretas, setCarretas] = useState<Veiculo[]>([]);

  const [motoristaId, setMotoristaId] = useState("");
  const [cavaloId, setCavaloId] = useState("");
  const [carretaId, setCarretaId] = useState("");
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [cliente, setCliente] = useState("");
  const [carga, setCarga] = useState("");
  const [peso, setPeso] = useState("");
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState("");

  const [conjuntoCarregado, setConjuntoCarregado] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      const { data: mot } = await supabase.from("motoristas").select("*").eq("ativo", true);
      const { data: cav } = await supabase.from("veiculos").select("*").eq("tipo", "CAVALO").eq("ativo", true);
      const { data: car } = await supabase.from("veiculos").select("*").eq("tipo", "CARRETA").eq("ativo", true);

      if (mot) setMotoristas(mot as Motorista[]);
      if (cav) setCavalos(cav as Veiculo[]);
      if (car) setCarretas(car as Veiculo[]);
    }
    carregarDados();
  }, []);

  const handleMotoristaChange = async (mId: string) => {
    setMotoristaId(mId);
    setConjuntoCarregado(false);

    if (!mId) return;

    // 1. Buscar se existe conjunto ativo cadastrado para este motorista
    const { data: vinculo } = await supabase
      .from("vinculos_conjunto")
      .select("cavalo_id, carreta_id")
      .eq("motorista_id", parseInt(mId))
      .eq("ativo", true)
      .maybeSingle();

    if (vinculo) {
      if (vinculo.cavalo_id) setCavaloId(vinculo.cavalo_id.toString());
      if (vinculo.carreta_id) setCarretaId(vinculo.carreta_id.toString());
      setConjuntoCarregado(true);
    } else {
      // 2. Se não houver vinculo_conjunto, busca veículo vinculado no cadastro do veículo
      const { data: veic } = await supabase
        .from("veiculos")
        .select("id, tipo")
        .eq("motorista_id", parseInt(mId))
        .eq("ativo", true);

      if (veic && veic.length > 0) {
        const cav = veic.find((v) => v.tipo === "CAVALO");
        const car = veic.find((v) => v.tipo === "CARRETA");
        if (cav) setCavaloId(cav.id.toString());
        if (car) setCarretaId(car.id.toString());
        setConjuntoCarregado(true);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErro("");

    if (!motoristaId || !cavaloId || !origem || !destino) {
      setErro("Preencha motorista, cavalo, origem e destino obrigatórios.");
      setSaving(false);
      return;
    }

    const codigo = `VG-${Date.now().toString().slice(-6)}`;

    // Insert Viagem
    const { data: viagemData, error: viagemErr } = await supabase
      .from("viagens")
      .insert({
        codigo_viagem: codigo,
        motorista_id: parseInt(motoristaId),
        cavalo_id: parseInt(cavaloId),
        carreta_id: carretaId ? parseInt(carretaId) : null,
        origem,
        destino,
        cliente_nome: cliente || null,
        carga_descricao: carga || null,
        peso_toneladas: peso ? parseFloat(peso) : null,
        status: "GARAGEM",
      })
      .select()
      .single();

    if (viagemErr || !viagemData) {
      setErro(formatarErroBanco(viagemErr));
      setSaving(false);
      return;
    }

    // Criar checklist dos 9 passos automaticamente
    await supabase.from("viagem_liberacao_checklist").insert({
      viagem_id: viagemData.id,
    });

    setSaving(false);
    router.push("/admin/viagens");
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Voltar */}
      <Link
        href="/admin/viagens"
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-500 hover:text-ink-900"
      >
        <ArrowLeft className="size-4" /> Voltar para o Quadro de Viagens
      </Link>

      <div className="rounded-2xl border border-ink-100 bg-white p-8 shadow-card">
        <h1 className="font-display text-2xl font-extrabold uppercase tracking-tight text-ink-900">
          Cadastrar Nova Viagem
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Informe os dados da operação para gerar o formulário de liberação.
        </p>

        <div className="mt-4">
          <FormErrorAlert erro={erro} />
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Motorista & Veículos */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-700">
                Motorista *
              </label>
              <select
                value={motoristaId}
                onChange={(e) => handleMotoristaChange(e.target.value)}
                required
                className="mt-1.5 w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm font-medium text-ink-900 focus:border-brand-600 focus:outline-none"
              >
                <option value="">Selecione...</option>
                {motoristas.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nome} ({m.cpf})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-700">
                Cavalo (Trator) *
              </label>
              <select
                value={cavaloId}
                onChange={(e) => setCavaloId(e.target.value)}
                required
                className="mt-1.5 w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm font-medium text-ink-900 focus:border-brand-600 focus:outline-none"
              >
                <option value="">Selecione...</option>
                {cavalos.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.placa} ({c.modelo})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-700">
                Carreta (Opcional)
              </label>
              <select
                value={carretaId}
                onChange={(e) => setCarretaId(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm font-medium text-ink-900 focus:border-brand-600 focus:outline-none"
              >
                <option value="">Nenhuma / Truck</option>
                {carretas.map((cr) => (
                  <option key={cr.id} value={cr.id}>
                    {cr.placa} ({cr.tipo_carreta || cr.modelo})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Rota (Origem & Destino) */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-700">
                Origem (Cidade/UF) *
              </label>
              <input
                type="text"
                placeholder="Ex: Betim/MG"
                value={origem}
                onChange={(e) => setOrigem(e.target.value)}
                required
                className="mt-1.5 w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm font-medium text-ink-900 focus:border-brand-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-700">
                Destino (Cidade/UF) *
              </label>
              <input
                type="text"
                placeholder="Ex: São Luís/MA"
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                required
                className="mt-1.5 w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm font-medium text-ink-900 focus:border-brand-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Cliente, Carga & Peso */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-700">
                Cliente / Embarcador
              </label>
              <input
                type="text"
                placeholder="Ex: Ambev / Plena"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm font-medium text-ink-900 focus:border-brand-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-700">
                Descrição da Carga
              </label>
              <input
                type="text"
                placeholder="Ex: Carne Frigorificada"
                value={carga}
                onChange={(e) => setCarga(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm font-medium text-ink-900 focus:border-brand-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-700">
                Peso (Toneladas)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="Ex: 27.5"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm font-medium text-ink-900 focus:border-brand-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Submeter */}
          <div className="flex justify-end pt-4 border-t border-ink-100">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-signal-500 px-6 py-3 text-sm font-bold text-white shadow-glow transition-all hover:bg-signal-600 disabled:opacity-50"
            >
              <Save className="size-4" />
              {saving ? "Salvando Viagem..." : "Cadastrar Viagem"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
