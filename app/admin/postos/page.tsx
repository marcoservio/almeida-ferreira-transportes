"use client";

import { useEffect, useState } from "react";
import { Building2, Plus, MapPin, CheckCircle2, Search, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PostoCombustivel } from "@/lib/supabase/types";
import { formatarErroBanco } from "@/lib/db-errors";
import { FormErrorAlert } from "@/components/admin/form-error-alert";

export default function PostosPage() {
  const [postos, setPostos] = useState<PostoCombustivel[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);

  const [nomeFantasia, setNomeFantasia] = useState("");
  const [razaoSocial, setRazaoSocial] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("MG");
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  const carregarPostos = async () => {
    setLoading(true);
    const { data } = await supabase.from("postos_combustivel").select("*").order("nome_fantasia", { ascending: true });
    if (data) setPostos(data as PostoCombustivel[]);
    setLoading(false);
  };

  useEffect(() => {
    carregarPostos();
  }, []);

  const handleExcluirPosto = async (id: number, nome: string) => {
    if (confirm(`Tem certeza que deseja excluir o posto ${nome}?`)) {
      const { error } = await supabase.from("postos_combustivel").delete().eq("id", id);
      if (!error) {
        carregarPostos();
      } else {
        setErro(formatarErroBanco(error));
      }
    }
  };

  const [erro, setErro] = useState("");

  const handleSalvarPosto = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErro("");

    const { error } = await supabase.from("postos_combustivel").insert({
      nome_fantasia: nomeFantasia,
      razao_social: razaoSocial || null,
      cnpj: cnpj || null,
      cidade,
      uf,
      parceiro: true,
    });

    if (error) {
      setErro(formatarErroBanco(error));
    } else {
      setModalAberto(false);
      setNomeFantasia("");
      setCnpj("");
      setCidade("");
      carregarPostos();
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-signal-500">
            Rede Credenciada
          </p>
          <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight text-ink-900">
            Postos de Combustível Parceiros
          </h1>
        </div>

        <button
          onClick={() => setModalAberto(true)}
          className="flex items-center gap-2 rounded-xl bg-signal-500 px-5 py-2.5 text-xs font-bold text-white shadow-glow transition-all hover:bg-signal-600"
        >
          <Plus className="size-4" /> Cadastrar Posto
        </button>
      </div>

      {/* Modal */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <h2 className="font-display text-xl font-bold uppercase text-ink-900 border-b border-ink-100 pb-3">
              Cadastrar Novo Posto Parceiro
            </h2>

            <FormErrorAlert erro={erro} />

            <form onSubmit={handleSalvarPosto} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-ink-700">Nome Fantasia *</label>
                <input
                  type="text"
                  placeholder="Posto Graal Betim / Posto Shell"
                  value={nomeFantasia}
                  onChange={(e) => setNomeFantasia(e.target.value)}
                  required
                  className="mt-1 w-full rounded-xl border border-ink-200 px-3.5 py-2 text-sm font-bold"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase text-ink-700">Cidade *</label>
                  <input
                    type="text"
                    placeholder="Betim"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    required
                    className="mt-1 w-full rounded-xl border border-ink-200 px-3.5 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-ink-700">UF *</label>
                  <input
                    type="text"
                    maxLength={2}
                    placeholder="MG"
                    value={uf}
                    onChange={(e) => setUf(e.target.value.toUpperCase())}
                    required
                    className="mt-1 w-full rounded-xl border border-ink-200 px-3.5 py-2 text-sm uppercase font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-ink-700">CNPJ (Opcional)</label>
                <input
                  type="text"
                  placeholder="00.000.000/0001-00"
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-ink-200 px-3.5 py-2 text-sm font-mono"
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
                  {saving ? "Salvando..." : "Salvar Posto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid de Postos */}
      <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
        {loading ? (
          <div className="py-12 text-center text-sm font-semibold text-ink-500">Carregando postos...</div>
        ) : postos.length === 0 ? (
          <div className="py-12 text-center">
            <Building2 className="mx-auto size-10 text-ink-300" />
            <p className="mt-2 text-sm font-semibold text-ink-600">Nenhum posto cadastrado.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {postos.map((p) => (
              <div key={p.id} className="rounded-xl border border-ink-100 bg-ink-50/50 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-ink-900 text-sm">{p.nome_fantasia}</h3>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                      Parceiro
                    </span>
                    <button
                      onClick={() => handleExcluirPosto(p.id, p.nome_fantasia)}
                      className="rounded p-1 text-ink-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Excluir Posto"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-ink-600 flex items-center gap-1">
                  <MapPin className="size-3.5 text-signal-500" /> {p.cidade} / {p.uf}
                </p>
                {p.cnpj && <p className="text-[11px] font-mono text-ink-400">CNPJ: {p.cnpj}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
