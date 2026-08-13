import {
  ArrowUpRight,
  Boxes,
  Package,
  Repeat,
  Route,
  Satellite,
  ShieldCheck,
  Snowflake,
  Truck,
  Warehouse,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { siteConfig } from "@/lib/site-config";

const icons: Record<string, LucideIcon> = {
  Package,
  Snowflake,
  Truck,
  Boxes,
  Repeat,
  Route,
  Satellite,
  ShieldCheck,
  Warehouse,
};

export function Services() {
  return (
    <section id="servicos" className="section bg-ink-50">
      <div className="container-site">
        <Reveal className="max-w-3xl">
          <span className="eyebrow">Serviços</span>

          <h2 className="heading-lg mt-5 text-ink-900">
            Soluções de transporte para{" "}
            <span className="text-brand-700">cada tipo de carga</span>
          </h2>

          <p className="mt-5 text-lg leading-relaxed text-ink-600">
            Da carreta dedicada ao volume fracionado, montamos a operação de
            acordo com o que a sua carga exige — inclusive controle de
            temperatura de ponta a ponta.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {siteConfig.services.map((service, i) => {
            const Icon = icons[service.icon] ?? Truck;

            return (
              <Reveal key={service.title} delay={(i % 3) * 90}>
                <article className="group relative h-full overflow-hidden rounded-2xl border border-ink-100 bg-white p-7 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover">
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-signal-500 transition-transform duration-300 group-hover:scale-x-100"
                  />

                  <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-700 group-hover:text-white">
                    <Icon className="size-7" />
                  </span>

                  <h3 className="mt-6 font-display text-2xl font-bold uppercase leading-tight tracking-wide text-ink-900">
                    {service.title}
                  </h3>

                  <p className="mt-3 leading-relaxed text-ink-600">
                    {service.description}
                  </p>

                  <ArrowUpRight
                    aria-hidden
                    className="absolute right-6 top-7 size-5 text-ink-200 transition-all group-hover:text-signal-500"
                  />
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={120}>
          <div className="mt-12 flex flex-col items-center justify-between gap-5 rounded-2xl border border-ink-100 bg-white p-7 text-center shadow-card sm:flex-row sm:text-left">
            <p className="text-lg text-ink-700">
              Não encontrou o que precisa?{" "}
              <span className="font-semibold text-ink-900">
                Conte a sua operação para nós
              </span>{" "}
              e montamos uma solução sob medida.
            </p>

            <a
              href="#contato"
              className="shrink-0 rounded-lg bg-brand-700 px-6 py-3.5 font-bold text-white transition-colors hover:bg-brand-800"
            >
              Falar com a equipe
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
