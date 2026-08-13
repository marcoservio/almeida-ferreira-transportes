import Link from "next/link";
import { Suspense } from "react";
import { AlertTriangle } from "lucide-react";
import { AuthCard } from "@/components/auth/auth-card";
import { whatsappLink } from "@/lib/site-config";

export const metadata = {
  title: "Erro de acesso",
};

async function ErrorContent({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <p className="mt-5 leading-relaxed text-ink-600">
      {params?.error
        ? "Não foi possível concluir o acesso. O link pode ter expirado ou já ter sido usado."
        : "Não foi possível concluir o acesso. Tente entrar novamente."}
      {params?.error && (
        <span className="mt-3 block break-words rounded-lg bg-ink-50 px-4 py-2 font-mono text-xs text-ink-500">
          {params.error}
        </span>
      )}
    </p>
  );
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <AuthCard title="Algo deu errado">
      <div className="flex flex-col items-center text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-signal-50 ring-1 ring-signal-200">
          <AlertTriangle className="size-7 text-signal-500" />
        </span>

        <Suspense>
          <ErrorContent searchParams={searchParams} />
        </Suspense>

        <Link
          href="/auth/login"
          className="mt-6 w-full rounded-lg bg-signal-500 px-6 py-3.5 font-bold text-white transition-colors hover:bg-signal-600"
        >
          Tentar entrar novamente
        </Link>

        <a
          href={whatsappLink(
            "Olá! Estou com erro para acessar a área do motorista.",
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 text-sm font-semibold text-brand-700 hover:underline"
        >
          Falar com a equipe
        </a>
      </div>
    </AuthCard>
  );
}
