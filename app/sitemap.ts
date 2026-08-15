import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

/**
 * Gera /sitemap.xml.
 *
 * O site é uma landing page única, então há uma URL só. Quando surgirem páginas
 * novas (blog, páginas por cidade, páginas por serviço), basta acrescentá-las
 * na lista abaixo.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/`,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
