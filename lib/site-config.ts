/**
 * Configuração central do site institucional.
 *
 * Tudo que é texto, número ou contato fica aqui — para ajustar o site
 * você não precisa mexer nos componentes, só neste arquivo.
 *
 * ⚠️ Os itens marcados com REVISAR são estimativas/placeholders.
 *    Confirme com a empresa antes de publicar.
 */

export const siteConfig = {
  name: "Almeida Ferreira Transportes",
  shortName: "Almeida Ferreira",
  legalName: "Almeida Ferreira Transportes LTDA", // REVISAR: razão social exata
  cnpj: "04.336.275/0001-51",
  tagline: "Sua carga no destino, no prazo e com segurança",
  subtitle:
    "Transporte rodoviário de cargas secas e refrigeradas com frota própria, rastreamento 24h e equipe que responde de verdade.",
  description:
    "Almeida Ferreira Transportes — transporte rodoviário de cargas secas e refrigeradas com frota própria, monitoramento 24h e cobertura nacional.",

  // ── Contato ────────────────────────────────────────────────────────────────
  contact: {
    phone: "(31) 98396-8417",
    phoneRaw: "5531983968417", // usado nos links de WhatsApp e tel:
    email: "almeidaferreiratransportes@gmail.com",
    hours: "Segunda a sexta, 8h às 18h",
    address: {
      street: "Rua Emereciana Pedro da Silva, 210 — Sala 26",
      district: "Jardim Teresópolis",
      city: "Betim",
      state: "MG",
      cep: "32681-350",
    },
  },

  // ── Navegação (âncoras da home) ────────────────────────────────────────────
  nav: [
    { label: "A empresa", href: "#empresa" },
    { label: "Serviços", href: "#servicos" },
    { label: "Frota", href: "#frota" },
    { label: "Cobertura", href: "#cobertura" },
    { label: "Contato", href: "#contato" },
  ],

  // ── Números ────────────────────────────────────────────────────────────────
  // REVISAR: todos os números abaixo precisam ser confirmados.
  stats: [
    { value: "+20", label: "anos de estrada", detail: "experiência acumulada" },
    { value: "15", label: "veículos na frota", detail: "cavalos e carretas" },
    { value: "99%", label: "entregas no prazo", detail: "índice de pontualidade" },
    { value: "24h", label: "monitoramento", detail: "rastreamento em tempo real" },
  ],

  // ── Serviços ───────────────────────────────────────────────────────────────
  services: [
    {
      icon: "Package",
      title: "Carga seca",
      description:
        "Transporte de carga geral em carretas baú, com lacre e conferência em cada etapa do trajeto.",
    },
    {
      icon: "Snowflake",
      title: "Cargas refrigeradas",
      description:
        "Carretas frigoríficas com controle de temperatura contínuo para alimentos e produtos que exigem cadeia fria.",
    },
    {
      icon: "Truck",
      title: "Lotação (FTL)",
      description:
        "Veículo dedicado exclusivamente à sua carga: menos manuseio, menos risco e prazo de porta a porta mais curto.",
    },
    {
      icon: "Boxes",
      title: "Carga fracionada",
      description:
        "Consolidação de volumes com custo proporcional ao que você embarca, ideal para reposição frequente.",
    },
    {
      icon: "Repeat",
      title: "Frota dedicada",
      description:
        "Veículos e motoristas alocados à sua operação, com roteiros fixos e indicadores acompanhados mês a mês.",
    },
    {
      icon: "Route",
      title: "Distribuição regional",
      description:
        "Coleta na indústria e entrega no centro de distribuição ou direto no cliente final, com roteirização própria.",
    },
    {
      icon: "Satellite",
      title: "Rastreamento e monitoramento",
      description:
        "Acompanhamento por satélite 24 horas, com registro de paradas, desvios de rota e cerca eletrônica.",
    },
    {
      icon: "ShieldCheck",
      title: "Gerenciamento de risco",
      description:
        "Motoristas cadastrados e consultados, plano de viagem aprovado e carga segurada durante todo o percurso.",
    },
    {
      icon: "Warehouse",
      title: "Armazenagem e transbordo",
      description:
        "Apoio para cross docking e transbordo de cargas, reduzindo tempo de espera entre os embarques.",
    },
  ],

  // ── Diferenciais ───────────────────────────────────────────────────────────
  differentials: [
    {
      icon: "Truck",
      title: "Frota própria e nova",
      description:
        "Cavalos mecânicos e carretas de baixa idade média, com manutenção preventiva em oficina parceira.",
    },
    {
      icon: "PhoneCall",
      title: "Atendimento direto",
      description:
        "Você fala com quem decide. Sem call center e sem protocolo: retorno no mesmo dia útil.",
    },
    {
      icon: "MapPinned",
      title: "Posição da carga sempre",
      description:
        "Informamos onde está o veículo e a previsão de chegada a qualquer momento da viagem.",
    },
    {
      icon: "FileCheck2",
      title: "Documentação em ordem",
      description:
        "CT-e, MDF-e, seguro e licenças em dia. Toda a frota com CRLV e ANTT regulares.",
    },
    {
      icon: "UserCheck",
      title: "Motoristas de confiança",
      description:
        "Equipe fixa, treinada e com histórico verificado.",
    },
    {
      icon: "Clock",
      title: "Prazo que se cumpre",
      description:
        "Planejamento de rota realista, com folga para imprevistos e comunicação imediata se algo mudar.",
    },
  ],

  // ── Frota ──────────────────────────────────────────────────────────────────
  fleet: [
    {
      title: "Carreta baú frigorífico",
      capacity: "Até 30 t",
      detail: "Controle de temperatura de -20 °C a +25 °C",
    },
    {
      title: "Carreta baú seco",
      capacity: "Até 30 t",
      detail: "Carga geral paletizada e volumes fechados",
    },
  ],

  // ── Cobertura ──────────────────────────────────────────────────────────────
  coverage: {
    headline: "Base em Minas Gerais, estrada em todo o Brasil",
    description:
      "Operamos a partir de Minas Gerais com viagens regulares para as regiões Sudeste, Centro-Oeste, Nordeste e Sul. Rotas fora da malha habitual são avaliadas caso a caso — consulte disponibilidade.",
    regions: [
      { name: "Sudeste", states: "MG · SP · RJ · ES", highlight: true },
      { name: "Centro-Oeste", states: "GO · DF · MT · MS", highlight: true },
      { name: "Nordeste", states: "BA · PE · CE · demais estados" },
      { name: "Sul", states: "PR · SC · RS" },
      { name: "Norte", states: "Sob consulta" },
    ],
  },

  // ── Segmentos atendidos ────────────────────────────────────────────────────
  segments: [
    "Indústria alimentícia",
    "Hortifrúti",
    "Embalagens",
    "Construção civil",
    "Varejo e distribuição",
    "Agronegócio",
    "Cargas paletizadas",
  ],
} as const;

export type SiteConfig = typeof siteConfig;

/** Link de WhatsApp já com mensagem pronta. */
export function whatsappLink(message?: string) {
  const base = `https://wa.me/${siteConfig.contact.phoneRaw}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}
