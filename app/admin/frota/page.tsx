"use client";

import { useEffect, useState } from "react";
import { Truck, Plus, ShieldAlert, CheckCircle2, Calendar, Wrench, Search, FileText, UserCheck, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Veiculo, TipoVeiculo, TipoCarreta, Motorista } from "@/lib/supabase/types";
import { formatarErroBanco } from "@/lib/db-errors";
import { FormErrorAlert } from "@/components/admin/form-error-alert";

export default function FrotaPage() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [busca, setBusca] = useState("");

  // Formulário Novo Veículo (Campos Obrigatórios)
  const [placa, setPlaca] = useState("");
  const [tipo, setTipo] = useState<TipoVeiculo>("CAVALO");
  const [tipoCarreta, setTipoCarreta] = useState<TipoCarreta>("BAU_FRIGORIFICO");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [anoFabricacao, setAnoFabricacao] = useState("");
  const [renavam, setRenavam] = useState("");
  const [chassi, setChassi] = useState("");

  // Campos Opcionais do CRLV
  const [anoModelo, setAnoModelo] = useState("");
  const [cor, setCor] = useState("Branco");
  const [combustivel, setCombustivel] = useState("Diesel S10");
  const [categoria, setCategoria] = useState("Aluguel");
  const [exercicioCrlv, setExercicioCrlv] = useState("");
  const [crlvVencimento, setCrlvVencimento] = useState("");
  const [anttVencimento, setAnttVencimento] = useState("");
  const [kronaVencimento, setKronaVencimento] = useState("");
  const [motoristaId, setMotoristaId] = useState("");
  
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState("");

  const supabase = createClient();

  const carregarFrota = async () => {
    setLoading(true);
    const { data: vData } = await supabase
      .from("veiculos")
      .select("*, motorista:motoristas(nome)")
      .order("placa", { ascending: true });

    const { data: mData } = await supabase.from("motoristas").select("*").eq("ativo", true);

    if (vData) setVeiculos(vData as unknown as Veiculo[]);
    if (mData) setMotoristas(mData as Motorista[]);
    setLoading(false);
  };

  useEffect(() => {
    carregarFrota();
  }, []);

  const handleExcluirVeiculo = async (id: number, placa: string) => {
    if (confirm(`Tem certeza que deseja excluir o veículo de placa ${placa}?`)) {
      const { error } = await supabase.from("veiculos").delete().eq("id", id);
      if (!error) {
        carregarFrota();
      } else {
        const mensagem = formatarErroBanco(error);
        setErro(mensagem);
        alert("Não foi possível excluir o veículo: " + mensagem);
      }
    }
  };

  const handleCadastrarVeiculo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErro("");

    if (!placa || !marca || !modelo || !anoFabricacao || !renavam || !chassi || !tipo) {
      setErro("Preencha placa, marca, modelo, ano, renavam, chassi e tipo obrigatórios.");
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("veiculos").insert({
      placa: placa.toUpperCase().trim(),
      tipo,
      tipo_carreta: tipo === "CARRETA" ? tipoCarreta : null,
      marca: marca.trim(),
      modelo: modelo.trim(),
      ano_fabricacao: parseInt(anoFabricacao),
      ano_modelo: anoModelo ? parseInt(anoModelo) : null,
      renavam: renavam.trim(),
      chassi: chassi.toUpperCase().trim(),
      cor: cor || null,
      combustivel: combustivel || null,
      categoria: categoria || null,
      exercicio_crlv: exercicioCrlv ? parseInt(exercicioCrlv) : null,
      crlv_vencimento: crlvVencimento || null,
      antt_vencimento: anttVencimento || null,
      checklist_krona_vencimento: kronaVencimento || null,
      motorista_id: motoristaId ? parseInt(motoristaId) : null,
      status: "DISPONIVEL",
    });

    if (error) {
      setErro(formatarErroBanco(error));
    } else {
      setModalAberto(false);
      setPlaca("");
      setMarca("");
      setModelo("");
      setRenavam("");
      setChassi("");
      carregarFrota();
    }
    setSaving(false);
  };

  const veiculosFiltrados = veiculos.filter((v) =>
    v.placa.toLowerCase().includes(busca.toLowerCase()) ||
    v.modelo.toLowerCase().includes(busca.toLowerCase()) ||
    v.renavam.toLowerCase().includes(busca.toLowerCase()) ||
    (v.motorista?.nome || "").toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-signal-500">
            Gerenciamento de Ativos & Documentação CRLV
          </p>
          <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight text-ink-900">
            Frota de Veículos (Cavalos & Carretas)
          </h1>
        </div>

        <button
          onClick={() => setModalAberto(true)}
          className="flex items-center gap-2 rounded-xl bg-signal-500 px-5 py-2.5 text-xs font-bold text-white shadow-glow transition-all hover:bg-signal-600"
        >
          <Plus className="size-4" /> Novo Veículo (CRLV)
        </button>
      </div>

      {/* Busca */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 size-4 text-ink-400" />
        <input
          type="text"
          placeholder="Buscar por placa, modelo, renavam ou motorista..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full rounded-xl border border-ink-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-ink-900 placeholder:text-ink-400 focus:outline-none"
        />
      </div>

      {/* Modal Cadastrar */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <h2 className="font-display text-xl font-bold uppercase text-ink-900 border-b border-ink-100 pb-3 flex items-center gap-2">
              <FileText className="size-5 text-brand-600" /> Cadastrar Veículo com Dados de CRLV
            </h2>

            <FormErrorAlert erro={erro} />

            <form onSubmit={handleCadastrarVeiculo} className="space-y-4 text-xs">
              {/* OBRIGATÓRIOS: Placa, Tipo, Marca, Modelo */}
              <div className="bg-ink-50 p-4 rounded-xl space-y-3 border border-ink-100">
                <p className="font-bold text-xs uppercase tracking-wider text-signal-500">
                  1. Dados Obrigatórios do Veículo
                </p>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block font-bold text-ink-700">Placa *</label>
                    <input
                      type="text"
                      placeholder="ABC-1D23"
                      value={placa}
                      onChange={(e) => setPlaca(e.target.value)}
                      required
                      className="mt-1 w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm font-mono font-bold uppercase"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-ink-700">Tipo de Veículo *</label>
                    <select
                      value={tipo}
                      onChange={(e) => setTipo(e.target.value as TipoVeiculo)}
                      className="mt-1 w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-xs font-bold"
                    >
                      <option value="CAVALO">Cavalo (Trator)</option>
                      <option value="CARRETA">Carreta</option>
                      <option value="TRUCK">Truck</option>
                      <option value="UTILITARIO">Utilitário</option>
                    </select>
                  </div>

                  {tipo === "CARRETA" && (
                    <div>
                      <label className="block font-bold text-ink-700">Tipo de Carreta</label>
                      <select
                        value={tipoCarreta}
                        onChange={(e) => setTipoCarreta(e.target.value as TipoCarreta)}
                        className="mt-1 w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-xs font-bold"
                      >
                        <option value="BAU_FRIGORIFICO">Baú Frigorífico (-20°C a +25°C)</option>
                        <option value="BAU_SECO">Baú Seco</option>
                        <option value="SIDER">Sider</option>
                        <option value="PRANCHA">Prancha</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block font-bold text-ink-700">Ano Fabricação *</label>
                    <input
                      type="number"
                      placeholder="2024"
                      value={anoFabricacao}
                      onChange={(e) => setAnoFabricacao(e.target.value)}
                      required
                      className="mt-1 w-full rounded-xl border border-ink-200 bg-white px-3 py-2 font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block font-bold text-ink-700">Marca *</label>
                    <input
                      type="text"
                      placeholder="Volvo / Scania / Randon"
                      value={marca}
                      onChange={(e) => setMarca(e.target.value)}
                      required
                      className="mt-1 w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-ink-700">Modelo *</label>
                    <input
                      type="text"
                      placeholder="FH 540 / R 450"
                      value={modelo}
                      onChange={(e) => setModelo(e.target.value)}
                      required
                      className="mt-1 w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block font-bold text-ink-700">Renavam *</label>
                    <input
                      type="text"
                      placeholder="00123456789"
                      value={renavam}
                      onChange={(e) => setRenavam(e.target.value)}
                      required
                      className="mt-1 w-full rounded-xl border border-ink-200 bg-white px-3 py-2 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-ink-700">Chassi *</label>
                    <input
                      type="text"
                      placeholder="9BWCA11108W00000"
                      value={chassi}
                      onChange={(e) => setChassi(e.target.value)}
                      required
                      className="mt-1 w-full rounded-xl border border-ink-200 bg-white px-3 py-2 font-mono uppercase font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* VÍNCULO DE MOTORISTA */}
              <div className="bg-brand-50/70 p-4 rounded-xl space-y-2 border border-brand-200">
                <label className="block font-bold text-brand-900 uppercase">
                  👤 Vincular Motorista Principal ao Veículo
                </label>
                <select
                  value={motoristaId}
                  onChange={(e) => setMotoristaId(e.target.value)}
                  className="w-full rounded-xl border border-brand-300 bg-white px-3 py-2 text-xs font-bold text-ink-900"
                >
                  <option value="">Nenhum motorista vinculado no momento</option>
                  {motoristas.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nome} ({m.cpf})
                    </option>
                  ))}
                </select>
              </div>

              {/* DADOS OPCIONAIS DO CRLV */}
              <div className="space-y-3 pt-2">
                <p className="font-bold text-xs uppercase tracking-wider text-ink-400">
                  2. Dados Opcionais do CRLV (Licenciamento)
                </p>

                <div className="grid gap-4 sm:grid-cols-4">
                  <div>
                    <label className="block font-bold text-ink-700">Ano Modelo</label>
                    <input
                      type="number"
                      placeholder="2025"
                      value={anoModelo}
                      onChange={(e) => setAnoModelo(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-ink-200 px-3 py-2 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-ink-700">Cor</label>
                    <input
                      type="text"
                      placeholder="Branco"
                      value={cor}
                      onChange={(e) => setCor(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-ink-200 px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-ink-700">Combustível</label>
                    <input
                      type="text"
                      placeholder="Diesel S10"
                      value={combustivel}
                      onChange={(e) => setCombustivel(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-ink-200 px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-ink-700">Exercício CRLV</label>
                    <input
                      type="number"
                      placeholder="2026"
                      value={exercicioCrlv}
                      onChange={(e) => setExercicioCrlv(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-ink-200 px-3 py-2 font-mono"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 border-t border-ink-100 pt-3">
                  <div>
                    <label className="block font-bold uppercase text-amber-800">Checklist Krona</label>
                    <input
                      type="date"
                      value={kronaVencimento}
                      onChange={(e) => setKronaVencimento(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-amber-300 bg-amber-50 px-2.5 py-1.5 font-bold text-amber-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-ink-700">Vencimento CRLV</label>
                    <input
                      type="date"
                      value={crlvVencimento}
                      onChange={(e) => setCrlvVencimento(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-ink-200 px-2.5 py-1.5"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-ink-700">Vencimento ANTT</label>
                    <input
                      type="date"
                      value={anttVencimento}
                      onChange={(e) => setAnttVencimento(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-ink-200 px-2.5 py-1.5"
                    />
                  </div>
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
                  className="rounded-xl bg-signal-500 px-6 py-2.5 text-xs font-bold text-white shadow-glow hover:bg-signal-600"
                >
                  {saving ? "Salvando Veículo..." : "Cadastrar Veículo CRLV"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabela de Frota com Dados do CRLV e Motorista */}
      <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
        {loading ? (
          <div className="py-12 text-center text-sm font-semibold text-ink-500">Carregando frota...</div>
        ) : veiculosFiltrados.length === 0 ? (
          <div className="py-12 text-center">
            <Truck className="mx-auto size-10 text-ink-300" />
            <p className="mt-2 text-sm font-semibold text-ink-600">Nenhum veículo cadastrado na frota.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-ink-100 bg-ink-50 text-ink-400 font-bold uppercase tracking-wider">
                  <th className="px-4 py-3">Placa / Tipo</th>
                  <th className="px-4 py-3">Marca / Modelo / Ano</th>
                  <th className="px-4 py-3">Renavam / Chassi</th>
                  <th className="px-4 py-3">Motorista Vinculado</th>
                  <th className="px-4 py-3">Checklist Krona</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {veiculosFiltrados.map((v) => (
                  <tr key={v.id} className="hover:bg-ink-50/50">
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-sm font-bold text-ink-900">{v.placa}</span>
                      <span className="ml-2 rounded bg-ink-100 px-2 py-0.5 text-[10px] font-bold text-ink-700">
                        {v.tipo}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-ink-800">
                      <p className="font-bold">{v.marca} {v.modelo}</p>
                      <p className="text-ink-500 text-[11px]">Ano: {v.ano_fabricacao} {v.ano_modelo ? `/ ${v.ano_modelo}` : ""} · {v.cor || "Branco"}</p>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[11px]">
                      <p><strong className="text-ink-400">REN:</strong> {v.renavam}</p>
                      <p className="text-ink-500"><strong className="text-ink-400">CHS:</strong> {v.chassi}</p>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-ink-900">
                      {v.motorista?.nome ? (
                        <span className="flex items-center gap-1 text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          👤 {v.motorista.nome}
                        </span>
                      ) : (
                        <span className="text-ink-400 italic">Sem motorista vinculado</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      {v.checklist_krona_vencimento ? (
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 font-semibold text-amber-900 border border-amber-200">
                          <ShieldAlert className="size-3 text-amber-600" />
                          {new Date(v.checklist_krona_vencimento).toLocaleDateString("pt-BR")}
                        </span>
                      ) : (
                        <span className="text-ink-400">Em dia</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-bold text-emerald-700 border border-emerald-200">
                        {v.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => handleExcluirVeiculo(v.id, v.placa)}
                        className="rounded-lg p-1.5 text-ink-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Excluir Veículo"
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
