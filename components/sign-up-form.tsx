"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserPlus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { traduzirErroAuth } from "@/lib/auth-errors";
import { useResetAoVoltar } from "@/components/auth/use-reset-ao-voltar";
import {
  AuthCard,
  AuthError,
  authButton,
  authField,
  authLabel,
} from "@/components/auth/auth-card";
import { cn } from "@/lib/utils";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useResetAoVoltar(() => setIsLoading(false));

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("As senhas não são iguais.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("A senha precisa ter no mínimo 6 caracteres.");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/protected`,
        },
      });
      if (error) throw error;
      router.replace("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(traduzirErroAuth(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn(className)} {...props}>
      <AuthCard
        title="Criar acesso"
        description="Cadastre seu e-mail e uma senha para acessar a área do motorista."
      >
        <form onSubmit={handleSignUp} className="space-y-5">
          <div>
            <label className={authLabel} htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="seuemail@exemplo.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={authField}
            />
          </div>

          <div>
            <label className={authLabel} htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="Mínimo de 6 caracteres"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={authField}
            />
          </div>

          <div>
            <label className={authLabel} htmlFor="repeat-password">
              Repetir a senha
            </label>
            <input
              id="repeat-password"
              type="password"
              autoComplete="new-password"
              placeholder="Digite a senha novamente"
              required
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              className={authField}
            />
          </div>

          {error && <AuthError message={error} />}

          <button type="submit" disabled={isLoading} className={authButton}>
            <UserPlus className="size-4" />
            {isLoading ? "Criando acesso…" : "Criar acesso"}
          </button>
        </form>

        <p className="mt-6 border-t border-ink-100 pt-6 text-center text-sm text-ink-500">
          Já tem cadastro?{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-brand-700 hover:underline"
          >
            Entrar
          </Link>
        </p>
      </AuthCard>
    </div>
  );
}
