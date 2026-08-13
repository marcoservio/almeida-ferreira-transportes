import { siteConfig } from "@/lib/site-config";
import { Reveal } from "@/components/site/reveal";

export function StatsStrip() {
  return (
    <section className="relative border-y border-white/10 bg-ink-900">
      <div aria-hidden className="absolute inset-0 stripes opacity-60" />

      <div className="container-site relative">
        <dl className="grid grid-cols-2 divide-white/10 md:grid-cols-4 md:divide-x">
          {siteConfig.stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 80}>
              <div className="px-2 py-8 text-center md:px-6 md:py-10">
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="font-display text-4xl font-extrabold text-white md:text-5xl">
                    {stat.value}
                  </span>
                  <span className="mt-2 block font-display text-base font-bold uppercase tracking-wide text-brand-300">
                    {stat.label}
                  </span>
                  <span className="mt-1 block text-xs text-ink-300">
                    {stat.detail}
                  </span>
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
