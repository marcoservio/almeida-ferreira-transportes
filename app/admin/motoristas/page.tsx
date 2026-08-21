"use client";

import { useEffect, useState } from "react";
import { Users, Plus, ShieldAlert, CheckCircle2, Phone, CreditCard, Search, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Motorista } from "@/lib/supabase/types";
import { formatarErroBanco } from "@/lib/db-errors";
import { FormErrorAlert } from "@/components/admin/form-error-alert";

export default function MotoristasPage() {
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [busca, setBusca] = useState("");

  // Formulário
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cnhNumero, setCnhNumero] = useState("");
  const [cnhCategoria, setCnhCategoria] = useState("E");
  const [cnhVencimento, setCnhVencimento] = useState("");
  const [chavePix, setChavePix] = useState("");
  const [saving, setSaving] = useState(false);

  const [erro, setErro] = useState("");

  const supabase = createClient();

  const carregarMotoristas = async () => {
    setLoading(true);
    const { data } = await supabase.from("motoristas").select("*").order("nome", { ascending: true });
    if (data) setMotoristas(data as Motorista[]);
    setLoading(false);
  };

  useEffect(() => {
    carregarMotoristas();
  }, []);

  const handleExcluirMotorista = async (id: number, nome: string) => {
    if (confirm(`Tem certeza que deseja excluir o motorista ${nome}?`)) {
      const { error } = await supabase.from("motoristas").delete().eq("id", id);
      if (!error) {
        carregarMotoristas();
      } else {
        setErro(formatarErroBanco(error));
      }
    }
  };

  const handleCadastrarMotorista = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErro("");

    const { error } = await supabase.from("motoristas").insert({
      nome: nome.trim(),
      cpf: cpf.trim(),
      telefone: telefone.trim(),
      cnh_numero: cnhNumero.trim(),
      cnh_categoria: cnhCategoria,
      cnh_vencimento: cnhVencimento,
      chave_pix: chavePix ? chavePix.trim() : null,
      ativo: true,
    });

    if (error) {
      setErro(formatarErroBanco(error));
    } else {
      setModalAberto(false);
      setNome("");
      setCpf("");
      setTelefone("");
      setCnhNumero("");
      setCnhVencimento("");
      setChavePix("");
      carregarMotoristas();
    }
    setSaving(false);
  };

  const motoristasFiltrados = motoristas.filter((m) =>
    m.nome.toLowerCase().includes(busca.toLowerCase()) ||
    m.cpf.toLowerCase().includes(busca.toLowerCase()) ||
    m.cnh_numero.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-signal-500">
            Equipe Operacional
          </p>
          <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight text-ink-900">
            Cadastro de Motoristas
          </h1>
        </div>

        <button
          onClick={() => setModalAberto(true)}
          className="flex items-center gap-2 rounded-xl bg-signal-500 px-5 py-2.5 text-xs font-bold text-white shadow-glow transition-all hover:bg-signal-600"
        >
          <Plus className="size-4" /> Novo Motorista
        </button>
      </div>

      {/* Busca */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 size-4 text-ink-400" />
        <input
          type="text"
          placeholder="Buscar por nome, CPF ou número da CNH..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full rounded-xl border border-ink-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-ink-900 placeholder:text-ink-400 focus:outline-none"
        />
      </div>

      {/* Modal Cadastrar */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <h2 className="font-display text-xl font-bold uppercase text-ink-900 border-b border-ink-100 pb-3">
              Cadastrar Novo Motorista
            </h2>

            <FormErrorAlert erro={erro} />

            <form onSubmit={handleCadastrarMotorista} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-ink-700">Nome Completo *</label>
                <input
                  type="text"
                  placeholder="Nome do motorista"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  className="mt-1 w-full rounded-xl border border-ink-200 px-3.5 py-2 text-sm font-semibold"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase text-ink-700">CPF *</label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    required
                    className="mt-1 w-full rounded-xl border border-ink-200 px-3.5 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-ink-700">Telefone / WhatsApp *</label>
                  <input
                    type="text"
                    placeholder="(31) 90000-0000"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    required
                    className="mt-1 w-full rounded-xl border border-ink-200 px-3.5 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-ink-700">Número CNH *</label>
                  <input
                    type="text"
                    placeholder="123456789"
                    value={cnhNumero}
                    onChange={(e) => setCnhNumero(e.target.value)}
                    required
                    className="mt-1 w-full rounded-xl border border-ink-200 px-3.5 py-2 text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-ink-700">Categoria *</label>
                  <select
                    value={cnhCategoria}
                    onChange={(e) => setCnhCategoria(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-ink-200 px-3.5 py-2 text-sm font-bold"
                  >
                    <option value="E">E</option>
                    <option value="D">D</option>
                    <option value="C">C</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-signal-700">Validade CNH *</label>
                  <input
                    type="date"
                    value={cnhVencimento}
                    onChange={(e) => setCnhVencimento(e.target.value)}
                    required
                    className="mt-1 w-full rounded-xl border border-signal-300 bg-signal-50 px-2.5 py-1.5 text-xs font-bold text-signal-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-ink-700">Chave PIX (Para acertos)</label>
                <input
                  type="text"
                  placeholder="CPF / Celular / E-mail / Aleatória"
                  value={chavePix}
                  onChange={(e) => setChavePix(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-ink-200 px-3.5 py-2 text-sm"
                />
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
                  {saving ? "Salvando..." : "Salvar Motorista"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabela de Motoristas */}
      <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
        {loading ? (
          <div className="py-12 text-center text-sm font-semibold text-ink-500">Carregando motoristas...</div>
        ) : motoristasFiltrados.length === 0 ? (
          <div className="py-12 text-center">
            <Users className="mx-auto size-10 text-ink-300" />
            <p className="mt-2 text-sm font-semibold text-ink-600">Nenhum motorista cadastrado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-ink-100 bg-ink-50 text-ink-400 font-bold uppercase tracking-wider">
                  <th className="px-4 py-3">Nome / CPF</th>
                  <th className="px-4 py-3">Contato</th>
                  <th className="px-4 py-3">CNH / Categoria</th>
                  <th className="px-4 py-3">Validade CNH</th>
                  <th className="px-4 py-3">Chave PIX</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {motoristasFiltrados.map((m) => (
                  <tr key={m.id} className="hover:bg-ink-50/50">
                    <td className="px-4 py-3.5">
                      <p className="font-bold text-ink-900 text-sm">{m.nome}</p>
                      <p className="text-ink-500">{m.cpf}</p>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-ink-800">
                      {m.telefone}
                    </td>
                    <td className="px-4 py-3.5 font-mono">
                      <span className="font-bold text-ink-900">{m.cnh_numero}</span>
                      <span className="ml-2 rounded bg-ink-100 px-2 py-0.5 text-[10px] font-bold text-ink-700">
                        Cat. {m.cnh_categoria}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-signal-50 px-2.5 py-1 font-bold text-signal-700 border border-signal-200">
                        {new Date(m.cnh_vencimento).toLocaleDateString("pt-BR")}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-ink-700 font-mono">
                      {m.chave_pix || "—"}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => handleExcluirMotorista(m.id, m.nome)}
                        className="rounded-lg p-1.5 text-ink-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Excluir Motorista"
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
