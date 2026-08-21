# Almeida Ferreira Transportes — Plataforma de Gestão de Frota & Site Institucional

Site institucional de alta conversão para a transportadora (Betim/MG) e **Painel Administrativo Completo** para gerenciamento operacional e financeiro de frota, viagens, abastecimentos, manutenções, multas, acertos com motoristas e checklist de liberação.

Next.js 16 (App Router) · React 19 · Tailwind CSS · Supabase PostgreSQL

---

## 🚀 Estrutura do Sistema

O sistema é dividido em duas grandes áreas mantidas de forma isolada e segura:

1. **Site Institucional Público (`/`)**:
   - Home estática com SEO avançado, dados estruturados JSON-LD, mapa de cobertura (Sudeste, Centro-Oeste, Nordeste e Sul), frota (carga seca e frigorificada), formulário de cotação de frete e link oficial do Instagram (`@almeidaferreiratransportes`).
2. **Painel Administrativo Restrito (`/admin`)**:
   - Plataforma exclusiva para a equipe do ADM da transportadora.
   - Substitui a antiga "Área do Motorista" por uma suíte completa de gestão.

---

## 🛠️ Rodando Localmente

```bash
npm install
npm run dev
```

O site e o painel sobem em <http://localhost:3000>.

Outros comandos:

| Comando         | O que faz                                  |
| --------------- | ------------------------------------------ |
| `npm run dev`   | servidor de desenvolvimento                |
| `npm run build` | build de produção (é o que a Vercel roda)  |
| `npm run start` | sobe o build de produção                   |
| `npm run lint`  | ESLint                                     |

---

## 🗄️ Estrutura do Banco de Dados (Supabase)

O banco de dados PostgreSQL no Supabase foi totalmente reestruturado e conta com 16 tabelas e tipos ENUM personalizados:

- `usuarios_adm`: Controle de acesso para colaboradores da transportadora com flag para forçar troca de senha no primeiro acesso.
- `motoristas`: Cadastro operacional com CNH, categoria, validade e chave PIX para pagamentos de acerto.
- `veiculos`: Cadastro de **Cavalos** e **Carretas** com vencimento de **Checklist Krona**, CRLV, ANTT e hodômetro.
- `vinculos_conjunto`: Histórico de alocação de conjuntos (Motorista + Cavalo + Carreta).
- `viagens`: Quadro Kanban com 7 etapas operacionais (`GARAGEM`, `SAIU_GARAGEM`, `EM_TRANSITO`, `CHEGOU_DESTINO`, `CARREGANDO_DESCARREGANDO`, `EM_RETORNO`, `CONCLUIDA`).
- `viagem_liberacao_checklist`: **Checklist dos 9 Passos de Liberação** (CTE, CIOT, SEFAZ, DACTE/DAMDFE, Rastreio, Rota Krona, SM Krona, Foto SM ao Motorista, E-mail).
- `documentos_fiscais`: Armazenamento de números, chaves e XMLs de CTEs e MDF-es.
- `postos_combustivel`: Cadastro da rede de postos credenciados.
- `abastecimentos`: Lançamento por veículo e posto, distinguindo pagamentos *À vista* (com reembolso ao motorista) e *A prazo* (faturado empresa).
- `manutencoes`: Registro de manutenções preventivas e corretivas.
- `multas`: Controle de autos de infração e indicação de condutores.
- `acertos_viagem`: Módulo de acerto financeiro com motoristas, calculando saldos de reembolso e descontos automaticamente.
- `configuracoes_alertas` & `alertas_sistema`: Notificações de vencimento de Checklist Krona, CNH, CRLV e alerta semanal para **Fechamento Plena Alimentos**.

---

## 🔒 Segurança & Proxy

- Todas as tabelas possuem **Row Level Security (RLS)** ativado.
- O [`proxy.ts`](proxy.ts) gerencia as sessões no Supabase SSR e protege as rotas administrativas.
- O matcher do proxy inclui exceções para `robots.txt`, `sitemap.xml` e arquivos `.html` em `public/` para impedir o bloqueio de crawlers do Googlebot.

---

## 📈 SEO & Indexação

- Configurações centralizadas em [`lib/site-config.ts`](lib/site-config.ts).
- Sitemap automático (`/sitemap.xml`), Robots (`/robots.txt`) e dados estruturados `LocalBusiness` / `AutomotiveBusiness`.
- As rotas administrativas (`/admin/*`) utilizam a diretiva `noindex, nofollow`.

---

## 🚀 Deploy

Hospedado na Vercel com deploy automático a cada push no repositório.
