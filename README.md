# Almeida Ferreira Transportes

Site institucional da transportadora (Betim/MG) com uma área interna onde o
motorista consulta a viagem atribuída a ele.

Next.js 16 (App Router) · React 19 · Tailwind CSS · Supabase

---

## Rodando localmente

```bash
npm install
npm run dev
```

O site sobe em <http://localhost:3000>.

Outros comandos:

| Comando         | O que faz                                  |
| --------------- | ------------------------------------------ |
| `npm run dev`   | servidor de desenvolvimento                |
| `npm run build` | build de produção (é o que a Vercel roda)  |
| `npm run start` | sobe o build de produção                   |
| `npm run lint`  | ESLint                                     |

## Variáveis de ambiente

Crie um `.env.local` na raiz:

```bash
# Obrigatórias — área do motorista não funciona sem elas
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=

# Opcionais
NEXT_PUBLIC_SITE_URL=                      # sobrescreve o domínio de produção
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=      # código do Google Search Console
```

As mesmas variáveis precisam estar cadastradas na Vercel
(**Settings → Environment Variables**). O `.env.local` fica só na sua máquina.

## Editando o conteúdo do site

**Quase tudo está em [`lib/site-config.ts`](lib/site-config.ts).** Textos,
telefone, e-mail, endereço, serviços, frota, regiões atendidas, números da
página e os dados de SEO ficam nesse arquivo — não é preciso abrir nenhum
componente para trocar um texto ou um telefone.

Os itens marcados com `REVISAR` são estimativas que ainda precisam ser
confirmadas com a empresa antes de virarem promessa pública.

A home é uma página única: [`app/page.tsx`](app/page.tsx) apenas empilha as
seções que estão em `components/site/`.

## SEO

Título, descrição e palavras-chave saem do bloco `seo` do `site-config.ts`.
A partir dele são gerados:

- `/robots.txt` — [`app/robots.ts`](app/robots.ts)
- `/sitemap.xml` — [`app/sitemap.ts`](app/sitemap.ts)
- dados estruturados JSON-LD — [`lib/seo.ts`](lib/seo.ts)

**Se o domínio mudar**, troque `url` no `site-config.ts` (ou defina
`NEXT_PUBLIC_SITE_URL`). Canonical, sitemap, robots e JSON-LD acompanham.

O arquivo `public/google*.html` é a verificação de propriedade do Google
Search Console e não deve ser removido.

⚠️ Arquivos servidos na raiz (`robots.txt`, `sitemap.xml`, `.html` da pasta
`public/`) precisam estar na lista de exceções do matcher em
[`proxy.ts`](proxy.ts). Sem isso o proxy do Supabase redireciona tudo para o
login — inclusive o Googlebot.

## Área do motorista

Rotas `/auth/*` (login e recuperação de senha) e `/protected` (viagem atual e
histórico). O acesso é controlado pelo Supabase Auth; o [`proxy.ts`](proxy.ts)
redireciona quem não está autenticado.

Os dados vêm de duas tabelas do Supabase: `motoristas` e `viagens`
(relacionadas pelo `id` do usuário).

**Não existe cadastro público.** Motorista novo é criado pelo painel do
Supabase em **Authentication → Users → Invite user**; ele define a própria
senha pelo link recebido, e depois basta criar a linha correspondente em
`motoristas`.

As páginas internas saem do Google por `noindex` — ver os `metadata` em
[`app/auth/layout.tsx`](app/auth/layout.tsx) e
[`app/protected/layout.tsx`](app/protected/layout.tsx).

## Deploy

Hospedado na Vercel, com deploy automático a cada push no `master`.
