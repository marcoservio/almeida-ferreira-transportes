"use client";

import Link from "next/link";
import { useState } from "react";
import { MailCheck, Send } from "lucide-react";
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

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useResetAoVoltar(() => setIsLoading(false));

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      // Esta URL precisa estar liberada em Authentication → URL Configuration no painel do Supabase.
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(traduzirErroAuth(error));
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className={cn(className)} {...props}>
        <AuthCard title="Verifique seu e-mail">
          <div className="flex flex-col items-center text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-200">
              <MailCheck className="size-7 text-emerald-600" />
            </span>

            <p className="mt-5 leading-relaxed text-ink-600">
              Se este e-mail estiver cadastrado, você vai receber um link para
              criar uma nova senha. Confira também a caixa de spam.
            </p>

            <Link
              href="/auth/login"
              className="mt-6 font-semibold text-brand-700 hover:underline"
            >
              Voltar para o login
            </Link>
          </div>
        </AuthCard>
      </div>
    );
  }

  return (
    <div className={cn(className)} {...props}>
      <AuthCard
        title="Recuperar senha"
        description="Informe seu e-mail e enviaremos um link para você criar uma nova senha."
      >
        <form onSubmit={handleForgotPassword} className="space-y-5">
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

          {error && <AuthError message={error} />}

          <button type="submit" disabled={isLoading} className={authButton}>
            <Send className="size-4" />
            {isLoading ? "Enviando…" : "Enviar link de recuperação"}
          </button>
        </form>

        <p className="mt-6 border-t border-ink-100 pt-6 text-center text-sm text-ink-500">
          Lembrou a senha?{" "}
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
