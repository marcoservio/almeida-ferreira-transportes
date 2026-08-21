"use client";

import { useEffect, useState } from "react";
import { Users, KeyRound, ShieldCheck, Lock, Info, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { UsuarioAdm } from "@/lib/supabase/types";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<UsuarioAdm[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const carregarUsuarios = async () => {
    setLoading(true);
    const { data } = await supabase.from("usuarios_adm").select("*").order("nome", { ascending: true });
    if (data) setUsuarios(data as UsuarioAdm[]);
    setLoading(false);
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const toggleTrocarSenha = async (id: string, valorAtual: boolean) => {
    await supabase.from("usuarios_adm").update({ trocar_senha_proximo_acesso: !valorAtual }).eq("id", id);
    carregarUsuarios();
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-signal-500">
          Segurança & Controle de Acesso
        </p>
        <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight text-ink-900">
          Usuários Administrativos
        </h1>
        <p className="text-sm text-ink-500">
          Controle quem possui permissão de acesso às informações confidenciais da transportadora.
        </p>
      </div>

      {/* Caixa Informativa sobre Segurança */}
      <div className="rounded-2xl bg-brand-50 border border-brand-200 p-5 flex items-start gap-4 text-brand-900">
        <Info className="size-6 text-brand-600 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <h3 className="font-bold text-sm">Gerenciamento de Acesso Seguro</h3>
          <p className="text-brand-800">
            Conforme as diretrizes de segurança, os convites de novos usuários ADM são criados diretamente no painel do Supabase em <strong>Authentication → Users → Invite user</strong>.
          </p>
          <p className="text-brand-800">
            Você pode forçar a obrigatoriedade de <strong>troca de senha no primeiro acesso</strong> para cada colaborador cadastrado.
          </p>
        </div>
      </div>

      {/* Tabela de Usuários ADM */}
      <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card space-y-4">
        <h2 className="font-display text-lg font-bold uppercase text-ink-900 border-b border-ink-100 pb-3">
          Colaboradores Cadastrados
        </h2>

        {loading ? (
          <div className="py-12 text-center text-sm font-semibold text-ink-500">Carregando usuários...</div>
        ) : usuarios.length === 0 ? (
          <div className="py-12 text-center text-ink-500 text-xs font-semibold">
            Nenhum usuário ADM listado na tabela complementar. O super-admin principal possui acesso master.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-ink-100 bg-ink-50 text-ink-400 font-bold uppercase tracking-wider">
                  <th className="px-4 py-3">Nome / E-mail</th>
                  <th className="px-4 py-3">Nível de Permissão (Role)</th>
                  <th className="px-4 py-3">Trocar Senha 1º Acesso</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {usuarios.map((u) => (
                  <tr key={u.id} className="hover:bg-ink-50/50">
                    <td className="px-4 py-3.5">
                      <p className="font-bold text-ink-900 text-sm">{u.nome}</p>
                      <p className="text-ink-500 font-mono">{u.email}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="rounded bg-brand-50 px-2.5 py-1 text-[10px] font-bold text-brand-800 border border-brand-200 uppercase">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => toggleTrocarSenha(u.id, u.trocar_senha_proximo_acesso)}
                        className={`rounded-lg px-3 py-1 font-bold text-[11px] border transition-colors ${
                          u.trocar_senha_proximo_acesso
                            ? "bg-amber-50 text-amber-900 border-amber-300"
                            : "bg-ink-50 text-ink-600 border-ink-200"
                        }`}
                      >
                        {u.trocar_senha_proximo_acesso ? "Sim (Obrigatório)" : "Não"}
                      </button>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-bold text-emerald-700 border border-emerald-200">
                        {u.ativo ? "Ativo" : "Inativo"}
                      </span>
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
