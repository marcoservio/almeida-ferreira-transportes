"use client";

import { useState } from "react";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { siteConfig, whatsappLink } from "@/lib/site-config";

const fieldClass =
  "w-full rounded-lg border border-ink-200 bg-white px-4 py-3 text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";

const labelClass = "mb-1.5 block text-sm font-semibold text-ink-700";

export function Contact() {
  const [sent, setSent] = useState(false);

  /**
   * O formulário monta uma mensagem pronta e abre o WhatsApp da empresa.
   * Assim funciona sem servidor de e-mail.
   * Para enviar por e-mail, troque este handler por um POST para uma
   * route handler em app/api/contato/route.ts.
   */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const linhas = [
      "*Nova solicitação de cotação — site*",
      "",
      `*Nome:* ${data.get("nome")}`,
      `*Empresa:* ${data.get("empresa") || "—"}`,
      `*Telefone:* ${data.get("telefone")}`,
      `*E-mail:* ${data.get("email") || "—"}`,
      `*Origem:* ${data.get("origem")}`,
      `*Destino:* ${data.get("destino")}`,
      `*Tipo de carga:* ${data.get("carga")}`,
      "",
      `*Detalhes:* ${data.get("mensagem") || "—"}`,
    ];

    window.open(whatsappLink(linhas.join("\n")), "_blank", "noopener");
    setSent(true);
  };

  return (
    <section id="contato" className="section bg-white">
      <div className="container-site">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <span className="eyebrow">Fale conosco</span>

            <h2 className="heading-lg mt-5 text-ink-900">
              Peça sua <span className="text-brand-700">cotação</span>
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-ink-600">
              Informe a rota e o tipo de carga. Respondemos com valor e prazo
              ainda no mesmo dia útil.
            </p>

            <ul className="mt-9 space-y-4">
              <li>
                <a
                  href={`tel:+${siteConfig.contact.phoneRaw}`}
                  className="group flex items-start gap-4 rounded-xl border border-ink-100 p-4 transition-colors hover:border-brand-200 hover:bg-ink-50"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-700 text-white transition-colors group-hover:bg-signal-500">
                    <Phone className="size-5" />
                  </span>
                  <span>
                    <span className="block text-sm text-ink-500">
                      Telefone e WhatsApp
                    </span>
                    <span className="block font-display text-xl font-bold tracking-wide text-ink-900">
                      {siteConfig.contact.phone}
                    </span>
                  </span>
                </a>
              </li>

              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="group flex items-start gap-4 rounded-xl border border-ink-100 p-4 transition-colors hover:border-brand-200 hover:bg-ink-50"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-700 text-white transition-colors group-hover:bg-signal-500">
                    <Mail className="size-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm text-ink-500">E-mail</span>
                    <span className="block break-all font-semibold text-ink-900">
                      {siteConfig.contact.email}
                    </span>
                  </span>
                </a>
              </li>

              <li className="flex items-start gap-4 rounded-xl border border-ink-100 p-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-ink-100 text-brand-700">
                  <MapPin className="size-5" />
                </span>
                <span>
                  <span className="block text-sm text-ink-500">Endereço</span>
                  <span className="block font-semibold text-ink-900">
                    {siteConfig.contact.address.street}
                  </span>
                  <span className="block text-sm text-ink-600">
                    {siteConfig.contact.address.district} ·{" "}
                    {siteConfig.contact.address.city}/
                    {siteConfig.contact.address.state} · CEP{" "}
                    {siteConfig.contact.address.cep}
                  </span>
                </span>
              </li>

              <li className="flex items-start gap-4 rounded-xl border border-ink-100 p-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-ink-100 text-brand-700">
                  <Clock className="size-5" />
                </span>
                <span>
                  <span className="block text-sm text-ink-500">
                    Atendimento comercial
                  </span>
                  <span className="block font-semibold text-ink-900">
                    {siteConfig.contact.hours}
                  </span>
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-ink-100 bg-ink-50 p-6 shadow-card sm:p-9">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="nome">
                    Seu nome *
                  </label>
                  <input
                    id="nome"
                    name="nome"
                    required
                    className={fieldClass}
                    placeholder="Nome completo"
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="empresa">
                    Empresa
                  </label>
                  <input
                    id="empresa"
                    name="empresa"
                    className={fieldClass}
                    placeholder="Razão social"
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="telefone">
                    Telefone *
                  </label>
                  <input
                    id="telefone"
                    name="telefone"
                    type="tel"
                    required
                    className={fieldClass}
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="email">
                    E-mail
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={fieldClass}
                    placeholder="voce@empresa.com.br"
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="origem">
                    Origem da carga *
                  </label>
                  <input
                    id="origem"
                    name="origem"
                    required
                    className={fieldClass}
                    placeholder="Cidade/UF"
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="destino">
                    Destino *
                  </label>
                  <input
                    id="destino"
                    name="destino"
                    required
                    className={fieldClass}
                    placeholder="Cidade/UF"
                  />
                </div>
              </div>

              <div>
                <label className={labelClass} htmlFor="carga">
                  Tipo de carga *
                </label>
                <select
                  id="carga"
                  name="carga"
                  required
                  defaultValue=""
                  className={fieldClass}
                >
                  <option value="" disabled>
                    Selecione
                  </option>
                  <option>Carga seca</option>
                  <option>Carga refrigerada</option>
                  <option>Carga congelada</option>
                  <option>Carga fracionada</option>
                  <option>Frota dedicada</option>
                  <option>Outro</option>
                </select>
              </div>

              <div>
                <label className={labelClass} htmlFor="mensagem">
                  Detalhes da operação
                </label>
                <textarea
                  id="mensagem"
                  name="mensagem"
                  rows={4}
                  className={`${fieldClass} resize-y`}
                  placeholder="Peso, volume, frequência de embarques, temperatura exigida…"
                />
              </div>

              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-lg bg-signal-500 px-6 py-4 font-bold text-white shadow-glow transition-colors hover:bg-signal-600"
              >
                Enviar pelo WhatsApp
                <Send className="size-4 transition-transform group-hover:translate-x-0.5" />
              </button>

              {sent && (
                <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                  Abrimos o WhatsApp com a sua solicitação. Se a janela não
                  apareceu, chame direto em {siteConfig.contact.phone}.
                </p>
              )}

              <p className="text-center text-xs text-ink-500">
                Ao enviar, seus dados são usados apenas para responder à
                cotação.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
