import { AlertCircle } from "lucide-react";

/** Classe compartilhada pelos campos dos formulários de acesso. */
export const authField =
  "w-full rounded-lg border border-ink-200 bg-white px-4 py-3 text-base text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";

export const authLabel = "mb-1.5 block text-sm font-semibold text-ink-700";

export const authButton =
  "flex w-full items-center justify-center gap-2 rounded-lg bg-signal-500 px-6 py-3.5 font-bold text-white transition-colors hover:bg-signal-600 disabled:cursor-not-allowed disabled:opacity-60";

export function AuthCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-7 shadow-card sm:p-9">
      <h1 className="font-display text-3xl font-extrabold uppercase leading-none tracking-tight text-ink-900">
        {title}
      </h1>

      {description && (
        <p className="mt-3 leading-relaxed text-ink-500">{description}</p>
      )}

      <div className="mt-7">{children}</div>
    </div>
  );
}

export function AuthError({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="flex items-start gap-2 rounded-lg bg-signal-50 px-4 py-3 text-sm font-medium text-signal-700 ring-1 ring-signal-200"
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" />
      {message}
    </p>
  );
}
