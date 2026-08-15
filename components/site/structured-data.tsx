import { homeJsonLd } from "@/lib/seo";

/**
 * Injeta os dados estruturados (JSON-LD) da home.
 *
 * Não renderiza nada visível: é a ficha que o Google lê para saber que a
 * Almeida Ferreira é uma transportadora em Betim/MG, com telefone, endereço,
 * horário e catálogo de serviços.
 */
export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      // O conteúdo é gerado pelo próprio site a partir de lib/site-config.ts,
      // nunca de entrada do usuário.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd()) }}
    />
  );
}
