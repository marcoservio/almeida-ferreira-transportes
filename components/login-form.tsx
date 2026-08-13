"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { traduzirErroAuth } from "@/lib/auth-errors";
import { useResetAoVoltar } from "@/components/auth/use-reset-ao-voltar";
import { whatsappLink } from "@/lib/site-config";
import {
  AuthCard,
  AuthError,
  authButton,
  authField,
  authLabel,
} from "@/components/auth/auth-card";
import { cn } from "@/lib/utils";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Destrava o botão se a página voltar do cache do navegador.
  useResetAoVoltar(() => setIsLoading(false));

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      // `refresh` sincroniza os componentes de servidor com a sessão nova antes
      // de navegar; `replace` deixa o login fora do histórico.
      router.refresh();
      router.replace("/protected");
    } catch (error: unknown) {
      setError(traduzirErroAuth(error));
    } finally {
      // Garante que o botão nunca fique preso em "Entrando…".
      setIsLoading(false);
    }
  };

  return (
    <div className={cn(className)} {...props}>
      <AuthCard
        title="Entrar"
        description="Use o e-mail e a senha cadastrados pela empresa para ver a sua viagem."
      >
        <form onSubmit={handleLogin} className="space-y-5">
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
            <div className="flex items-center justify-between gap-3">
              <label className={authLabel} htmlFor="password">
                Senha
              </label>
              <Link
                href="/auth/forgot-password"
                className="mb-1.5 text-sm font-semibold text-brand-700 hover:underline"
              >
                Esqueci a senha
              </Link>
            </div>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={cn(authField, "pr-12")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                className="absolute right-1 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-md text-ink-400 transition-colors hover:text-ink-700"
              >
                {showPassword ? (
                  <EyeOff className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </button>
            </div>
          </div>

          {error && <AuthError message={error} />}

          <button type="submit" disabled={isLoading} className={authButton}>
            <LogIn className="size-4" />
            {isLoading ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <p className="mt-6 border-t border-ink-100 pt-6 text-center text-sm text-ink-500">
          Primeiro acesso ou ainda sem cadastro?{" "}
          <a
            href={whatsappLink(
              "Olá! Sou motorista e gostaria de solicitar meu acesso à área do motorista.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand-700 hover:underline"
          >
            Solicite à empresa
          </a>
        </p>
      </AuthCard>
    </div>
  );
}
