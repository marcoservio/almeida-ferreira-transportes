import { CheckCircle2, PackageCheck, PhoneCall, Radar, Truck } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { siteConfig } from "@/lib/site-config";

const steps = [
  {
    icon: PhoneCall,
    title: "1. Cotação",
    text: "Você informa origem, destino e o tipo de carga. Retornamos com o valor e o prazo.",
  },
  {
    icon: Truck,
    title: "2. Coleta",
    text: "Veículo adequado no local combinado, com conferência e lacre na carga.",
  },
  {
    icon: Radar,
    title: "3. Viagem monitorada",
    text: "Rastreamento ativo e atualização de posição sempre que você precisar.",
  },
  {
    icon: PackageCheck,
    title: "4. Entrega comprovada",
    text: "Descarga acompanhada e comprovante enviado no encerramento da viagem.",
  },
];

export function Coverage() {
  return (
    <section id="cobertura" className="section bg-ink-50">
      <div className="container-site">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <span className="eyebrow">Atuação e cobertura</span>

            <h2 className="heading-lg mt-5 text-ink-900">
              {siteConfig.coverage.headline}
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-ink-600">
              {siteConfig.coverage.description}
            </p>

            <ul className="mt-8 divide-y divide-ink-100 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card">
              {siteConfig.coverage.regions.map((region) => (
                <li
                  key={region.name}
                  className="flex items-center justify-between gap-4 px-6 py-4"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2
                      className={
                        "highlight" in region && region.highlight
                          ? "size-5 shrink-0 text-signal-500"
                          : "size-5 shrink-0 text-ink-300"
                      }
                    />
                    <span className="font-display text-lg font-bold uppercase tracking-wide text-ink-900">
                      {region.name}
                    </span>
                  </div>

                  <span className="text-right text-sm text-ink-500">
                    {region.states}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-4 text-sm text-ink-500">
              Rotas destacadas em vermelho têm viagens regulares.
            </p>
          </Reveal>

          <Reveal delay={140}>
            <div className="rounded-3xl bg-brand-900 p-8 md:p-10">
              <span className="font-display text-sm font-bold uppercase tracking-[0.18em] text-brand-300">
                Como trabalhamos
              </span>

              <h3 className="heading-md mt-3 text-white">
                Do orçamento à comprovação de entrega
              </h3>

              <ol className="mt-9 space-y-8">
                {steps.map((step, i) => (
                  <li key={step.title} className="relative flex gap-5">
                    {i < steps.length - 1 && (
                      <span
                        aria-hidden
                        className="absolute left-[1.375rem] top-12 h-[calc(100%+0.75rem)] w-px bg-white/15"
                      />
                    )}

                    <span className="relative flex size-11 shrink-0 items-center justify-center rounded-full bg-signal-500">
                      <step.icon className="size-5 text-white" />
                    </span>

                    <div className="pt-1">
                      <p className="font-display text-lg font-bold uppercase tracking-wide text-white">
                        {step.title}
                      </p>
                      <p className="mt-1 leading-relaxed text-ink-200">
                        {step.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
