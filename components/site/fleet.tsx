import Image from "next/image";
import { Gauge, Snowflake, Wrench } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { siteConfig } from "@/lib/site-config";

const care = [
  {
    icon: Wrench,
    title: "Manutenção preventiva",
    text: "Revisão programada por quilometragem, não por quebra.",
  },
  {
    icon: Snowflake,
    title: "Equipamento de frio aferido",
    text: "Registro de temperatura em toda a viagem refrigerada.",
  },
  {
    icon: Gauge,
    title: "Telemetria embarcada",
    text: "Velocidade, jornada e paradas acompanhadas de perto.",
  },
];

export function Fleet() {
  return (
    <section id="frota" className="relative overflow-hidden bg-ink-950">
      {/* Foto da frota como fundo da seção */}
      <Image
        src="/caminhao-scania.jpeg"
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="object-cover object-[center_35%] opacity-25"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/90 to-ink-950/60"
      />

      <div className="container-site relative py-20 md:py-28">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <span className="eyebrow">Nossa frota</span>

            <h2 className="heading-lg mt-5 text-white">
              Equipamento certo,{" "}
              <span className="text-brand-300">em ordem e rastreado</span>
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-ink-200">
              Frota própria, com documentação e licenças em dia, preparada tanto
              para carga seca paletizada quanto para produtos que precisam de
              cadeia fria contínua.
            </p>

            <ul className="mt-9 space-y-6">
              {care.map((item) => (
                <li key={item.title} className="flex gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5">
                    <item.icon className="size-5 text-signal-500" />
                  </span>
                  <div>
                    <p className="font-display text-lg font-bold uppercase tracking-wide text-white">
                      {item.title}
                    </p>
                    <p className="text-sm text-ink-300">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {siteConfig.fleet.map((vehicle, i) => (
              <Reveal key={vehicle.title} delay={i * 90}>
                <article className="group h-full rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-colors hover:border-signal-500/50 hover:bg-white/[0.07]">
                  <p className="font-display text-3xl font-extrabold text-signal-500">
                    {vehicle.capacity}
                  </p>

                  <h3 className="mt-3 font-display text-xl font-bold uppercase leading-tight tracking-wide text-white">
                    {vehicle.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-ink-300">
                    {vehicle.detail}
                  </p>
                </article>
              </Reveal>
            ))}

            <Reveal delay={360} className="sm:col-span-2">
              <div className="flex flex-col items-start gap-4 rounded-2xl bg-signal-500 p-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-display text-xl font-bold uppercase leading-tight tracking-wide text-white">
                  Precisa de um veículo dedicado para a sua rota?
                </p>
                <a
                  href="#contato"
                  className="shrink-0 rounded-lg bg-white px-6 py-3 font-bold text-signal-600 transition-colors hover:bg-ink-50"
                >
                  Consultar disponibilidade
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
