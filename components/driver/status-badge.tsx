import { cn } from "@/lib/utils";

type Tone = "blue" | "green" | "amber" | "red" | "slate";

const tones: Record<Tone, string> = {
  blue: "bg-brand-50 text-brand-700 ring-brand-200",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  red: "bg-signal-50 text-signal-700 ring-signal-200",
  slate: "bg-ink-100 text-ink-700 ring-ink-200",
};

const dots: Record<Tone, string> = {
  blue: "bg-brand-500",
  green: "bg-emerald-500",
  amber: "bg-amber-500",
  red: "bg-signal-500",
  slate: "bg-ink-400",
};

/** Descobre a cor a partir do texto do status, sem exigir valores fixos no banco. */
function toneFor(status: string): Tone {
  const s = status
    .toLowerCase()
    .replace(/[áàâã]/g, "a")
    .replace(/[éê]/g, "e")
    .replace(/í/g, "i")
    .replace(/[óôõ]/g, "o")
    .replace(/ú/g, "u")
    .replace(/ç/g, "c");

  if (/(andamento|transito|viagem|rodando|carregad)/.test(s)) return "blue";
  if (/(conclu|entreg|finaliz|encerrad)/.test(s)) return "green";
  if (/(pendente|aguard|agendad|previst)/.test(s)) return "amber";
  if (/(cancel|problema|atras|recusad)/.test(s)) return "red";
  return "slate";
}

export function StatusBadge({
  status,
  className,
  size = "md",
}: {
  status?: string | null;
  className?: string;
  size?: "sm" | "md";
}) {
  const label = status?.trim() || "Sem status";
  const tone = toneFor(label);

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-2 rounded-full font-semibold ring-1",
        size === "md" ? "px-3.5 py-1.5 text-sm" : "px-2.5 py-1 text-xs",
        tones[tone],
        className,
      )}
    >
      <span className={cn("size-2 rounded-full", dots[tone])} />
      <span className="capitalize">{label}</span>
    </span>
  );
}
