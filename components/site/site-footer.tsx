import Link from "next/link";
import { Mail, MapPin, Phone, Truck } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-ink-950 text-ink-300">
      <div aria-hidden className="absolute inset-0 stripes opacity-40" />
      <div aria-hidden className="h-1 w-full bg-signal-500" />

      <div className="container-site relative py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo size="lg" />

            <p className="mt-6 max-w-sm leading-relaxed">
              {siteConfig.description}
            </p>
          </div>

          <nav>
            <p className="font-display text-lg font-bold uppercase tracking-wide text-white">
              Navegação
            </p>

            <ul className="mt-5 space-y-3">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="transition-colors hover:text-white"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-2 font-semibold text-white transition-colors hover:text-signal-400"
                >
                  <Truck className="size-4 text-signal-500" />
                  Área do motorista
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <p className="font-display text-lg font-bold uppercase tracking-wide text-white">
              Contato
            </p>

            <ul className="mt-5 space-y-4">
              <li>
                <a
                  href={`tel:+${siteConfig.contact.phoneRaw}`}
                  className="flex items-start gap-3 transition-colors hover:text-white"
                >
                  <Phone className="mt-0.5 size-4 shrink-0 text-signal-500" />
                  {siteConfig.contact.phone}
                </a>
              </li>

              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="flex items-start gap-3 break-all transition-colors hover:text-white"
                >
                  <Mail className="mt-0.5 size-4 shrink-0 text-signal-500" />
                  {siteConfig.contact.email}
                </a>
              </li>

              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-signal-500" />
                <span>
                  {siteConfig.contact.address.street}
                  <br />
                  {siteConfig.contact.address.district} ·{" "}
                  {siteConfig.contact.address.city}/
                  {siteConfig.contact.address.state}
                  <br />
                  CEP {siteConfig.contact.address.cep}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-8 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {siteConfig.legalName} · CNPJ {siteConfig.cnpj}
          </p>
          <p>Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
