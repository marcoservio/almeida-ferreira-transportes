"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Trava o scroll do corpo enquanto o menu mobile está aberto.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || open
          ? "border-b border-white/10 bg-ink-950/95 backdrop-blur-md"
          : "border-b border-transparent bg-gradient-to-b from-ink-950/80 to-transparent",
      )}
    >
      <div className="container-site flex h-20 items-center justify-between gap-6">
        {/* Clicar na logo volta ao topo da página (sem recarregar). */}
        <a
          href="#inicio"
          aria-label="Voltar ao topo da página"
          onClick={(event) => {
            event.preventDefault();
            setOpen(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <Logo size="md" href={null} priority />
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {siteConfig.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-semibold text-ink-100 transition-colors hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`tel:+${siteConfig.contact.phoneRaw}`}
            className="hidden items-center gap-2 text-sm font-semibold text-white xl:flex"
          >
            <Phone className="size-4 text-signal-500" />
            {siteConfig.contact.phone}
          </a>

          <Link
            href="/auth/login"
            className="rounded-lg border border-white/25 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Área do motorista
          </Link>

          <a
            href="#contato"
            className="rounded-lg bg-signal-500 px-4 py-2.5 text-sm font-bold text-white shadow-glow transition-colors hover:bg-signal-600"
          >
            Solicitar cotação
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          className="inline-flex size-11 items-center justify-center rounded-lg border border-white/20 text-white transition-colors hover:bg-white/10 lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="animate-slide-down border-t border-white/10 bg-ink-950 lg:hidden">
          <nav className="container-site flex flex-col py-4">
            {siteConfig.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-white/5 py-3.5 font-display text-lg font-bold uppercase tracking-wide text-white"
              >
                {item.label}
              </a>
            ))}

            <div className="mt-5 flex flex-col gap-3 pb-6">
              <a
                href="#contato"
                onClick={() => setOpen(false)}
                className="rounded-lg bg-signal-500 px-4 py-3.5 text-center font-bold text-white"
              >
                Solicitar cotação
              </a>

              <Link
                href="/auth/login"
                className="rounded-lg border border-white/25 px-4 py-3.5 text-center font-semibold text-white"
              >
                Área do motorista
              </Link>

              <a
                href={`tel:+${siteConfig.contact.phoneRaw}`}
                className="flex items-center justify-center gap-2 py-2 text-sm font-semibold text-ink-200"
              >
                <Phone className="size-4 text-signal-500" />
                {siteConfig.contact.phone}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
