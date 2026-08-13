import { Logo } from "@/components/site/logo";
import { DriverLogoutButton } from "@/components/driver/logout-button";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export function DriverTopbar({
  name,
  subtitle,
}: {
  name: string;
  subtitle?: string;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink-950">
      <div aria-hidden className="h-1 w-full bg-signal-500" />

      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo size="sm" priority />

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">
              Motorista
            </p>
            <p className="max-w-[16rem] truncate text-sm font-semibold text-white">
              {name}
            </p>
            {subtitle && (
              <p className="max-w-[16rem] truncate text-xs text-ink-400">
                {subtitle}
              </p>
            )}
          </div>

          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-600 font-display text-base font-bold text-white ring-2 ring-white/15">
            {initials(name)}
          </span>

          <DriverLogoutButton />
        </div>
      </div>
    </header>
  );
}
