import { Compass, Handshake, Target } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { siteConfig } from "@/lib/site-config";

const mvv = [
  {
    icon: Target,
    title: "Missão",
    text: "Transportar a carga do cliente com segurança e pontualidade, tratando cada embarque como se fosse o único.",
  },
  {
    icon: Compass,
    title: "Visão",
    text: "Ser a transportadora que o embarcador chama primeiro quando o frete não pode dar errado.",
  },
  {
    icon: Handshake,
    title: "Valores",
    text: "Palavra cumprida, transparência no preço, cuidado com o motorista e respeito ao prazo combinado.",
  },
];

export function About() {
  return (
    <section id="empresa" className="section bg-white">
      <div className="container-site">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <span className="eyebrow">A empresa</span>

            <h2 className="heading-lg mt-5 text-ink-900">
              Uma transportadora feita por gente que{" "}
              <span className="text-brand-700">conhece a estrada</span>
            </h2>

            <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink-600">
              <p>
                A {siteConfig.name} nasceu do trabalho no chão de operação: carga
                conferida, veículo revisado e motorista acompanhado de perto. Com
                frota própria de carretas secas e frigoríficas, atendemos
                indústrias e distribuidores que não podem perder um prazo.
              </p>

              <p>
                Trabalhamos com um número controlado de clientes justamente para
                manter o padrão: cada operação tem plano de viagem, rastreamento
                ativo e um responsável que você conhece pelo nome. Nada de
                protocolo — você liga e fala com quem resolve.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-signal-500 bg-ink-50 p-6">
              <p className="font-display text-xl font-bold uppercase leading-tight text-ink-900">
                &ldquo;Se a carga é sua, a responsabilidade é nossa.&rdquo;
              </p>
              <p className="mt-2 text-sm text-ink-500">
                É assim que tratamos todo embarque, do primeiro contato à
                comprovação de entrega.
              </p>
            </div>
          </Reveal>

          <div className="space-y-5">
            {mvv.map((item, i) => (
              <Reveal key={item.title} delay={i * 100}>
                <article className="group flex gap-5 rounded-2xl border border-ink-100 bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card-hover">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-700 text-white transition-colors group-hover:bg-signal-500">
                    <item.icon className="size-6" />
                  </span>

                  <div>
                    <h3 className="font-display text-xl font-bold uppercase tracking-wide text-ink-900">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 leading-relaxed text-ink-600">
                      {item.text}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}

            <Reveal delay={300}>
              <div className="rounded-2xl bg-brand-900 p-6 text-white">
                <p className="font-display text-lg font-bold uppercase tracking-wide">
                  Segmentos que atendemos
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {siteConfig.segments.map((segment) => (
                    <span
                      key={segment}
                      className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-ink-100"
                    >
                      {segment}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
