import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, MapPin, Satellite } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

const highlights = [
  "Frota própria de carga seca e refrigerada",
  "Rastreamento por satélite 24 horas",
  "Atendimento direto com quem decide",
];

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-ink-950 pb-16 pt-32 md:pb-24 md:pt-40"
    >
      {/* Fundo: grade, brilhos e uma faixa vermelha inspirada na logo */}
      <div
        aria-hidden
        className="absolute inset-0 bg-grid-ink [background-size:56px_56px] opacity-40"
      />
      <div
        aria-hidden
        className="absolute -left-40 top-0 size-[42rem] rounded-full bg-brand-700/40 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -right-32 bottom-0 size-[32rem] rounded-full bg-brand-500/20 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -left-20 top-24 h-32 w-[60rem] -rotate-6 bg-gradient-to-r from-signal-500/0 via-signal-500/20 to-signal-500/0 blur-2xl"
      />

      <div className="container-site relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div className="animate-fade-up">
            <span className="eyebrow">Transporte rodoviário de cargas</span>

            <h1 className="heading-xl mt-5 text-white">
              {siteConfig.tagline.split(",")[0]},
              <span className="block text-brand-300">
                {siteConfig.tagline.split(",").slice(1).join(",").trim()}
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-200">
              {siteConfig.subtitle}
            </p>

            <ul className="mt-8 space-y-3">
              {highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm font-medium text-ink-100"
                >
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-signal-500">
                    <Check className="size-3 text-white" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href="#contato"
                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-signal-500 px-7 py-4 font-bold text-white shadow-glow transition-colors hover:bg-signal-600"
              >
                Solicitar cotação
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href="#servicos"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/25 px-7 py-4 font-semibold text-white transition-colors hover:bg-white/10"
              >
                Ver nossos serviços
              </a>
            </div>

            <p className="mt-6 text-sm text-ink-300">
              É motorista da equipe?{" "}
              <Link
                href="/auth/login"
                className="font-semibold text-white underline decoration-signal-500 decoration-2 underline-offset-4 hover:text-brand-200"
              >
                Acesse a área do motorista
              </Link>
            </p>
          </div>

          {/* Foto da frota */}
          <div className="relative animate-fade-up [animation-delay:150ms]">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl ring-1 ring-white/15 lg:max-w-none">
              <Image
                src="/caminhao-scania.jpeg"
                alt="Carreta frigorífica da frota Almeida Ferreira Transportes em rodovia"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 45vw"
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-ink-950/5 to-transparent"
              />

              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-2xl border border-white/15 bg-ink-950/70 p-4 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-signal-500">
                    <Satellite className="size-5 text-white" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-white">
                      Carga monitorada
                    </p>
                    <p className="text-xs text-ink-200">
                      Posição e temperatura em tempo real
                    </p>
                  </div>
                </div>
                <span className="flex size-2.5 shrink-0 animate-pulse rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" />
              </div>
            </div>

            <div className="absolute -left-2 top-6 hidden items-center gap-2 rounded-xl border border-white/15 bg-ink-900/90 px-4 py-3 backdrop-blur-md sm:flex lg:-left-6">
              <MapPin className="size-4 text-signal-500" />
              <span className="text-sm font-semibold text-white">
                {siteConfig.contact.address.city}/{siteConfig.contact.address.state}
                <span className="ml-1 font-normal text-ink-300">
                  · cobertura nacional
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
