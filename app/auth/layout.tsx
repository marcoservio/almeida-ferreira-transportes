import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Headset, MapPin, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { siteConfig, whatsappLink } from "@/lib/site-config";

// Área interna: fora do Google, para não competir com a home nos resultados.
export const metadata: Metadata = {
  title: "Área do motorista",
  robots: { index: false, follow: false },
};

const pontos = [
  { icon: MapPin, text: "Veja a origem, o destino e a carga da sua viagem" },
  { icon: ShieldCheck, text: "Acesso individual e protegido por senha" },
  { icon: Headset, text: "Suporte direto com a equipe pelo WhatsApp" },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-svh lg:grid-cols-[1.05fr_1fr]">
      {/* Painel de marca */}
      <div className="relative hidden overflow-hidden bg-ink-950 lg:block">
        <Image
          src="/caminhao-scania.jpeg"
          alt=""
          aria-hidden
          fill
          sizes="55vw"
          className="object-cover object-[center_40%] opacity-30"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-ink-950 via-ink-950/85 to-brand-900/70"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-grid-ink [background-size:56px_56px] opacity-30"
        />

        <div className="relative flex h-full flex-col justify-between p-12">
          <Logo size="lg" priority />

          <div>
            <p className="eyebrow">Área do motorista</p>
            <h2 className="heading-lg mt-4 max-w-md text-white">
              Sua viagem, seus dados,{" "}
              <span className="text-brand-300">na palma da mão</span>
            </h2>

            <ul className="mt-8 space-y-4">
              {pontos.map((ponto) => (
                <li key={ponto.text} className="flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/5">
                    <ponto.icon className="size-4 text-signal-500" />
                  </span>
                  <span className="text-ink-200">{ponto.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-sm text-ink-400">© {siteConfig.name}</p>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col bg-ink-50">
        <div className="flex items-center justify-between gap-4 border-b border-ink-100 bg-ink-950 px-5 py-4 lg:hidden">
          <Logo size="sm" priority />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-200"
          >
            <ArrowLeft className="size-4" />
            Site
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center p-5 sm:p-10">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="mb-6 hidden items-center gap-1.5 text-sm font-semibold text-ink-500 transition-colors hover:text-brand-700 lg:inline-flex"
            >
              <ArrowLeft className="size-4" />
              Voltar ao site
            </Link>

            {children}

            <p className="mt-8 text-center text-sm text-ink-500">
              Problemas para acessar?{" "}
              <a
                href={whatsappLink(
                  "Olá! Sou motorista e estou com problema para acessar a área do motorista.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand-700 underline decoration-signal-500 decoration-2 underline-offset-4"
              >
                Chame a equipe no WhatsApp
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
