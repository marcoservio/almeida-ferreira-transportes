# 🚛 Almeida Ferreira Transportes — Sistema de Gestão Operacional & Frotas

Sistema web moderno e completo para gestão de frotas, viagens, manutenção, controle financeiro de acertos de motoristas, abastecimentos e infrações de trânsito para a **Almeida Ferreira Transportes**.

![Next.js](https://img.shields.io/badge/Next.js-16.3.0-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3.4-38bdf8?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-emerald?logo=supabase)

---

## 📌 Principais Funcionalidades

- **🚚 Cadastro Completo de Veículos (CRLV)**: Registro detalhado com placa, Renavam, Chassi, Marca, Modelo, Ano Fabricação/Modelo, Cor e Categoria.
- **⛓️ Formação de Conjuntos Operacionais**: Vínculo do trio **Motorista + Cavalo + Carreta** com auto-complete inteligente na criação de viagens e acertos.
- **🗺️ Gestão de Viagens (Quadro Kanban)**: Acompanhamento em tempo real de 7 etapas da viagem (*Na Garagem, Saiu Garagem, Em Trânsito, Chegou Destino, Carga/Descarga, Em Retorno, Concluída*).
- **📋 Checklist de Liberação de 9 Passos**: Inspeção rigorosa de liberação de viagem e atendimento ao contrato Krona.
- **💰 Acerto de Viagem com Motorista**: Calculadora financeira automatizada distinguindo despesas reembolsáveis à vista, custos diretos da empresa a prazo e saldo líquido final a pagar.
- **⛽ Controle de Abastecimentos**: Lançamento por veículo, motorista, posto parceiro e tipo de pagamento (à vista vs faturado).
- **🔧 Gestão de Manutenção**: Registro de intervenções preventivas e corretivas com hodômetro.
- **🚨 Multas de Trânsito & Pontuação CNH**: Controle de infrações e pontuação acumulada por motorista.
- **🗑️ Exclusão Segura com Confirmação**: Exclusão direta pela interface em todas as tabelas e cadastros.

---

## 🛠️ Tecnologias Utilizadas

- **Framework**: [Next.js 16.3.0](https://nextjs.org/) (App Router & Turbopack)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/) & Vanilla Utilities
- **Banco de Dados & Autenticação**: [Supabase PostgreSQL](https://supabase.com/)
- **Ícones**: [Lucide React](https://lucide.dev/)

---

## 🚀 Como Rodar o Projeto Localmente

### 1. Pré-requisitos
Certifique-se de ter instalado em sua máquina:
- **Node.js** (`v18.x` ou superior — recomendado `v20.x`)
- **npm** (incluso com o Node) ou **yarn** / **pnpm**

---

### 2. Clonar o Repositório
```bash
git clone https://github.com/JoaoAlmeida02/almeida-ferreira-transportes.git
cd almeida-ferreira-transportes
```

---

### 3. Instalar as Dependências
```bash
npm install
```

---

### 4. Configurar as Variáveis de Ambiente (`.env.local`)
Crie um arquivo chamado `.env.local` na raiz do projeto com o seguinte conteúdo:

```env
# Conexão com o Supabase
NEXT_PUBLIC_SUPABASE_URL=https://eewkffcheydwtmydzawx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_pQH-fqR0AYo750PJyPch7w_KrSB56_V
```

---

### 5. Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```

A aplicação estará disponível em:
- 🌐 **Site Institucional**: [http://localhost:3000](http://localhost:3000)
- 🔒 **Painel de Gestão ADM**: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 🔑 Usuário de Teste / Acesso Administrativo

Para entrar no Painel de Gestão Operacional ADM ([http://localhost:3000/auth/login](http://localhost:3000/auth/login)), utilize o usuário de teste:

- **E-mail**: `admin@almeidaferreira.com`
- **Senha**: `123456`

---

## 🗄️ Estrutura do Banco de Dados (Supabase PostgreSQL)

| Tabela | Descrição |
| :--- | :--- |
| `motoristas` | Cadastro de motoristas, CNH, vencimento, telefone e chave PIX. |
| `veiculos` | Cadastro de veículos com ficha técnica e do documento CRLV. |
| `vinculos_conjunto` | Vínculos de frotas operacionais (Motorista + Cavalo + Carreta). |
| `viagens` | Registro das viagens e status das etapas da operação. |
| `viagem_liberacao_checklist` | Checklist de verificação de segurança dos 9 passos. |
| `acertos_viagem` | Lançamento e fechamento financeiro de acerto com motoristas. |
| `abastecimentos` | Histórico de abastecimentos de combustível da frota. |
| `manutencoes` | Registro de manutenções preventivas e corretivas. |
| `multas` | Controle de infrações de trânsito. |
| `postos_combustivel` | Rede de postos parceiros conveniados. |

---

## 📦 Comandos Úteis

```bash
# Iniciar ambiente de desenvolvimento com Turbopack
npm run dev

# Gerar o build de produção compilado
npx next build

# Executar a versão de produção compilada
npm run start
```

---

## 📄 Licença
Propriedade privada de **Almeida Ferreira Transportes**. Todos os direitos reservados.
