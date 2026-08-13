// A página depende da sessão (cookies), então não pode ser pré-renderizada:
// isso libera a rota a renderizar de forma bloqueante no request.
export const instant = false;

import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  FileText,
  Headset,
  Info,
  MapPin,
  Navigation,
  Package,
  Phone,
  Truck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/driver/status-badge";
import { DataDeHoje } from "@/components/driver/data-de-hoje";
import { siteConfig, whatsappLink } from "@/lib/site-config";

export const metadata = {
  title: "Área do motorista",
};

type Viagem = {
  id: string | number;
  origem: string | null;
  destino: string | null;
  carga: string | null;
  observacoes: string | null;
  status: string | null;
  created_at: string | null;
};

type Motorista = {
  nome: string | null;
  telefone: string | null;
  placa: string | null;
  modelo_veiculo: string | null;
};

const dataCurta = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function formatarData(valor: string | null, formato = dataCurta) {
  if (!valor) return null;
  const data = new Date(valor);
  return Number.isNaN(data.getTime()) ? null : formato.format(data);
}

function linkMaps(origem?: string | null, destino?: string | null) {
  if (!destino) return null;
  const params = new URLSearchParams({ api: "1", destination: destino });
  if (origem) params.set("origin", origem);
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // O layout já redireciona quem não está autenticado.
  if (!user) return null;

  const { data: motoristaData } = await supabase
    .from("motoristas")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const { data: viagensData } = await supabase
    .from("viagens")
    .select("*")
    .eq("motorista_id", user.id)
    .order("created_at", { ascending: false });

  const motorista = (motoristaData ?? null) as Motorista | null;
  const viagens = (viagensData ?? []) as Viagem[];

  const viagemAtual = viagens[0];
  const anteriores = viagens.slice(1);

  const primeiroNome = motorista?.nome?.split(" ")[0] ?? "motorista";
  const identificacao = [motorista?.nome, motorista?.placa]
    .filter(Boolean)
    .join(" — ");

  const rota = viagemAtual
    ? `${viagemAtual.origem ?? "origem"} → ${viagemAtual.destino ?? "destino"}`
    : null;

  const maps = viagemAtual
    ? linkMaps(viagemAtual.origem, viagemAtual.destino)
    : null;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      {/* Saudação */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-signal-500">
            Área do motorista
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-tight text-ink-900 sm:text-4xl">
            Olá, {primeiroNome}
          </h1>
          <p className="mt-1 text-ink-500">
            Aqui estão os dados da sua viagem e do seu veículo.
          </p>
        </div>

        <p className="flex items-center gap-2 rounded-lg border border-ink-100 bg-white px-4 py-2.5 text-sm font-medium text-ink-600 shadow-sm">
          <CalendarDays className="size-4 text-brand-600" />
          <DataDeHoje />
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* ── Coluna principal ─────────────────────────────────────────── */}
        <div className="space-y-6 lg:col-span-2">
          <section className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-ink-950 px-6 py-5">
              <div className="flex items-center gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-signal-500">
                  <Truck className="size-6 text-white" />
                </span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink-400">
                    Viagem atual
                  </p>
                  <p className="font-display text-xl font-bold uppercase tracking-wide text-white">
                    {viagemAtual ? rota : "Nenhuma viagem ativa"}
                  </p>
                </div>
              </div>

              {viagemAtual && (
                <StatusBadge status={viagemAtual.status} className="bg-white" />
              )}
            </div>

            {!viagemAtual ? (
              <div className="px-6 py-14 text-center">
                <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-ink-100">
                  <Truck className="size-7 text-ink-400" />
                </span>
                <p className="mt-4 font-display text-xl font-bold uppercase text-ink-900">
                  Sem viagem cadastrada
                </p>
                <p className="mx-auto mt-2 max-w-sm text-ink-500">
                  Quando a empresa registrar uma viagem para você, os detalhes
                  aparecem aqui automaticamente.
                </p>
                <a
                  href={whatsappLink(
                    `Olá! Sou ${identificacao || primeiroNome} e gostaria de saber sobre a minha próxima viagem.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-700 px-5 py-3 font-semibold text-white transition-colors hover:bg-brand-800"
                >
                  <Headset className="size-4" />
                  Falar com a empresa
                </a>
              </div>
            ) : (
              <div className="p-6">
                {/* Rota */}
                <ol className="relative space-y-6">
                  <span
                    aria-hidden
                    className="absolute left-[0.6875rem] top-3 h-[calc(100%-1.5rem)] w-0.5 bg-gradient-to-b from-brand-500 to-signal-500"
                  />

                  <li className="relative flex gap-4">
                    <span className="z-10 mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-600 ring-4 ring-brand-100">
                      <MapPin className="size-3.5 text-white" />
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
                        Origem
                      </p>
                      <p className="text-lg font-semibold text-ink-900">
                        {viagemAtual.origem ?? "Não informada"}
                      </p>
                    </div>
                  </li>

                  <li className="relative flex gap-4">
                    <span className="z-10 mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-signal-500 ring-4 ring-signal-100">
                      <CheckCircle2 className="size-3.5 text-white" />
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
                        Destino
                      </p>
                      <p className="text-lg font-semibold text-ink-900">
                        {viagemAtual.destino ?? "Não informado"}
                      </p>
                    </div>
                  </li>
                </ol>

                {/* Detalhes */}
                <dl className="mt-7 grid gap-4 border-t border-ink-100 pt-6 sm:grid-cols-2">
                  <div className="flex gap-3">
                    <Package className="mt-0.5 size-5 shrink-0 text-brand-600" />
                    <div>
                      <dt className="text-xs font-bold uppercase tracking-wider text-ink-400">
                        Carga
                      </dt>
                      <dd className="font-medium text-ink-900">
                        {viagemAtual.carga ?? "Não informada"}
                      </dd>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <CalendarDays className="mt-0.5 size-5 shrink-0 text-brand-600" />
                    <div>
                      <dt className="text-xs font-bold uppercase tracking-wider text-ink-400">
                        Registrada em
                      </dt>
                      <dd className="font-medium text-ink-900">
                        {formatarData(viagemAtual.created_at) ?? "—"}
                      </dd>
                    </div>
                  </div>

                  <div className="flex gap-3 sm:col-span-2">
                    <Info className="mt-0.5 size-5 shrink-0 text-brand-600" />
                    <div>
                      <dt className="text-xs font-bold uppercase tracking-wider text-ink-400">
                        Observações
                      </dt>
                      <dd className="font-medium text-ink-900">
                        {viagemAtual.observacoes ?? "Nenhuma observação."}
                      </dd>
                    </div>
                  </div>
                </dl>

                {/* Ações da viagem */}
                <div className="mt-7 grid gap-3 border-t border-ink-100 pt-6 sm:grid-cols-3">
                  {maps && (
                    <a
                      href={maps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-700 px-4 py-3.5 font-semibold text-white transition-colors hover:bg-brand-800"
                    >
                      <Navigation className="size-4" />
                      Abrir rota
                    </a>
                  )}

                  <a
                    href={whatsappLink(
                      `Olá! Sou ${identificacao || primeiroNome}. Cheguei ao destino da viagem ${rota}.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-ink-200 bg-white px-4 py-3.5 font-semibold text-ink-800 transition-colors hover:bg-ink-50"
                  >
                    <CheckCircle2 className="size-4 text-emerald-600" />
                    Avisar chegada
                  </a>

                  <a
                    href={whatsappLink(
                      `Olá! Sou ${identificacao || primeiroNome}. Tive um problema na viagem ${rota}: `,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-ink-200 bg-white px-4 py-3.5 font-semibold text-ink-800 transition-colors hover:bg-ink-50"
                  >
                    <AlertTriangle className="size-4 text-signal-500" />
                    Reportar problema
                  </a>
                </div>
              </div>
            )}
          </section>

          {/* Histórico */}
          <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-ink-900">
                Viagens anteriores
              </h2>
              <span className="rounded-full bg-ink-100 px-3 py-1 text-sm font-semibold text-ink-600">
                {anteriores.length}
              </span>
            </div>

            {anteriores.length === 0 ? (
              <p className="mt-5 rounded-xl bg-ink-50 px-5 py-8 text-center text-ink-500">
                Você ainda não tem viagens anteriores registradas.
              </p>
            ) : (
              <ul className="mt-5 divide-y divide-ink-100">
                {anteriores.map((viagem) => (
                  <li
                    key={viagem.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-ink-900">
                        {viagem.origem ?? "—"}{" "}
                        <span className="text-ink-300">→</span>{" "}
                        {viagem.destino ?? "—"}
                      </p>
                      <p className="mt-0.5 text-sm text-ink-500">
                        {[formatarData(viagem.created_at), viagem.carga]
                          .filter(Boolean)
                          .join(" · ") || "Sem detalhes"}
                      </p>
                    </div>

                    <StatusBadge status={viagem.status} size="sm" />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* ── Coluna lateral ───────────────────────────────────────────── */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
            <h2 className="font-display text-xl font-bold uppercase tracking-wide text-ink-900">
              Seu veículo
            </h2>

            <div className="mt-5 space-y-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
                  Placa
                </p>
                <p className="mt-1.5 inline-block rounded-lg border-2 border-ink-800 bg-ink-50 px-4 py-2 font-mono text-xl font-bold uppercase tracking-[0.2em] text-ink-900">
                  {motorista?.placa ?? "—"}
                </p>
              </div>

              <div className="flex gap-3">
                <Truck className="mt-0.5 size-5 shrink-0 text-brand-600" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
                    Modelo
                  </p>
                  <p className="font-semibold text-ink-900">
                    {motorista?.modelo_veiculo ?? "Não informado"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Phone className="mt-0.5 size-5 shrink-0 text-brand-600" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
                    Seu telefone
                  </p>
                  <p className="font-semibold text-ink-900">
                    {motorista?.telefone ?? "Não informado"}
                  </p>
                </div>
              </div>
            </div>

            {!motorista && (
              <p className="mt-5 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200">
                Seu cadastro de motorista ainda não foi vinculado. Fale com a
                empresa para liberar seus dados.
              </p>
            )}
          </section>

          {/* Suporte */}
          <section className="overflow-hidden rounded-2xl bg-brand-900 p-6 text-white shadow-card">
            <span className="flex size-11 items-center justify-center rounded-xl bg-white/10">
              <Headset className="size-6" />
            </span>

            <h2 className="mt-4 font-display text-xl font-bold uppercase tracking-wide">
              Precisa de ajuda?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-200">
              Fale direto com a equipe da {siteConfig.shortName} em horário
              comercial ou em caso de urgência na estrada.
            </p>

            <a
              href={whatsappLink(
                `Olá! Sou ${identificacao || primeiroNome} e preciso de apoio.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-signal-500 px-4 py-3.5 font-bold text-white transition-colors hover:bg-signal-600"
            >
              Chamar no WhatsApp
            </a>

            <a
              href={`tel:+${siteConfig.contact.phoneRaw}`}
              className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-white/25 px-4 py-3.5 font-semibold text-white transition-colors hover:bg-white/10"
            >
              <Phone className="size-4" />
              {siteConfig.contact.phone}
            </a>
          </section>

          {/* Documentos */}
          <section className="rounded-2xl border border-dashed border-ink-200 bg-white p-6">
            <div className="flex items-start gap-3">
              <FileText className="mt-0.5 size-5 shrink-0 text-ink-400" />
              <div>
                <h2 className="font-display text-lg font-bold uppercase tracking-wide text-ink-900">
                  Documentos
                </h2>
                <p className="mt-1 text-sm text-ink-500">
                  Envio de CNH, comprovantes e canhotos direto pelo painel.
                </p>
                <span className="mt-3 inline-block rounded-full bg-ink-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink-500">
                  Em breve
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
