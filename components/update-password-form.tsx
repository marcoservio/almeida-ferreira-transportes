"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { KeyRound } from "lucide-react";
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

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useResetAoVoltar(() => setIsLoading(false));

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("As senhas não são iguais.");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      router.refresh();
      router.replace("/protected");
    } catch (error: unknown) {
      setError(traduzirErroAuth(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn(className)} {...props}>
      <AuthCard
        title="Nova senha"
        description="Escolha uma senha que você consiga lembrar — mínimo de 6 caracteres."
      >
        <form onSubmit={handleUpdatePassword} className="space-y-5">
          <div>
            <label className={authLabel} htmlFor="password">
              Nova senha
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
              Repetir a nova senha
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
            <KeyRound className="size-4" />
            {isLoading ? "Salvando…" : "Salvar nova senha"}
          </button>
        </form>
      </AuthCard>
    </div>
  );
}
