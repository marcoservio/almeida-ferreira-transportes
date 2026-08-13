import {
  Clock,
  FileCheck2,
  MapPinned,
  PhoneCall,
  Truck,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { siteConfig } from "@/lib/site-config";

const icons: Record<string, LucideIcon> = {
  Truck,
  PhoneCall,
  MapPinned,
  FileCheck2,
  UserCheck,
  Clock,
};

export function Differentials() {
  return (
    <section className="section bg-white">
      <div className="container-site">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">Por que a {siteConfig.shortName}</span>

          <h2 className="heading-lg mt-5 text-ink-900">
            O que muda quando a transportadora{" "}
            <span className="text-brand-700">é presente</span>
          </h2>

          <p className="mt-5 text-lg leading-relaxed text-ink-600">
            Frete não é só preço por quilômetro. É saber onde está a carga, ter
            quem atenda o telefone e receber o veículo no horário combinado.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {siteConfig.differentials.map((item, i) => {
            const Icon = icons[item.icon] ?? Truck;

            return (
              <Reveal key={item.title} delay={(i % 3) * 90}>
                <div className="flex gap-4">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-signal-50 text-signal-500 ring-1 ring-signal-100">
                    <Icon className="size-6" />
                  </span>

                  <div>
                    <h3 className="font-display text-xl font-bold uppercase leading-tight tracking-wide text-ink-900">
                      {item.title}
                    </h3>
                    <p className="mt-2 leading-relaxed text-ink-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
