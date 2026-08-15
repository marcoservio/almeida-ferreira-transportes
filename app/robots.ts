import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

/**
 * Gera /robots.txt.
 *
 * As páginas de /auth/ NÃO são bloqueadas aqui de propósito. Elas saem do
 * Google pela tag `noindex` (ver app/auth/layout.tsx), e o robô só lê essa tag
 * se puder abrir a página. Bloquear no robots.txt teria o efeito inverso:
 * o /auth/login, que o Google já rastreou, ficaria preso no índice sem
 * descrição e sem como sair.
 *
 * /protected/ continua bloqueado: sem sessão ele só redireciona para o login,
 * então não há nada para o robô ler ali.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/protected/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
