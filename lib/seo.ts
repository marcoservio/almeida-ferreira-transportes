/**
 * Utilidades de SEO.
 *
 * Aqui ficam a URL base do site e os dados estruturados (JSON-LD) que o Google
 * lê para entender que a Almeida Ferreira é uma transportadora real, em Betim/MG,
 * com telefone, endereço e uma lista de serviços.
 */

import { siteConfig } from "@/lib/site-config";

/**
 * URL base do site, sem barra no final.
 *
 * Ordem de prioridade:
 * 1. NEXT_PUBLIC_SITE_URL — para quando o domínio mudar sem mexer no código;
 * 2. siteConfig.url — o domínio de produção;
 * 3. localhost — só em desenvolvimento, quando não há domínio configurado.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  siteConfig.url ||
  "http://localhost:3000"
).replace(/\/$/, "");

/** Monta uma URL absoluta a partir de um caminho da aplicação. */
export function absoluteUrl(path = "/") {
  return new URL(path, `${siteUrl}/`).toString();
}

const ORG_ID = `${siteUrl}/#organizacao`;
const SITE_ID = `${siteUrl}/#site`;

/**
 * Dados estruturados da home, no formato @graph.
 *
 * Descreve a empresa (LocalBusiness), o site (WebSite) e a página (WebPage),
 * além do catálogo de serviços. É o que habilita o resultado rico do Google
 * com endereço, telefone e horário de atendimento.
 */
export function homeJsonLd() {
  const { contact, seo } = siteConfig;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "LocalBusiness"],
        "@id": ORG_ID,
        name: siteConfig.name,
        legalName: siteConfig.legalName,
        alternateName: siteConfig.shortName,
        description: seo.description,
        slogan: siteConfig.tagline,
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl("/logo-almeida-ferreira.png"),
        },
        image: absoluteUrl("/caminhao-scania.jpeg"),
        telephone: `+${contact.phoneRaw}`,
        email: contact.email,
        taxID: siteConfig.cnpj,
        vatID: siteConfig.cnpj,
        currenciesAccepted: "BRL",
        knowsLanguage: "pt-BR",
        address: {
          "@type": "PostalAddress",
          streetAddress: contact.address.street,
          addressLocality: contact.address.city,
          addressRegion: contact.address.state,
          postalCode: contact.address.cep,
          addressCountry: "BR",
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [...contact.openingHours.days],
            opens: contact.openingHours.opens,
            closes: contact.openingHours.closes,
          },
        ],
        areaServed: seo.areaServed.map((name) => ({
          "@type": "State",
          name,
        })),
        knowsAbout: [...siteConfig.segments],
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "sales",
            telephone: `+${contact.phoneRaw}`,
            email: contact.email,
            areaServed: "BR",
            availableLanguage: "Portuguese",
          },
        ],
        ...(seo.sameAs.length > 0 ? { sameAs: seo.sameAs } : {}),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Serviços de transporte rodoviário de cargas",
          itemListElement: siteConfig.services.map((service) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: service.title,
              description: service.description,
              serviceType: service.title,
              provider: { "@id": ORG_ID },
              areaServed: "BR",
            },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": SITE_ID,
        url: siteUrl,
        name: siteConfig.name,
        description: seo.description,
        inLanguage: "pt-BR",
        publisher: { "@id": ORG_ID },
      },
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/#home`,
        url: siteUrl,
        name: seo.title,
        description: seo.description,
        inLanguage: "pt-BR",
        isPartOf: { "@id": SITE_ID },
        about: { "@id": ORG_ID },
        primaryImageOfPage: absoluteUrl("/caminhao-scania.jpeg"),
      },
    ],
  };
}
