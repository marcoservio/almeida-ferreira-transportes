"use client";

import { AlertTriangle, XCircle } from "lucide-react";

interface FormErrorAlertProps {
  erro?: string | null;
}

export function FormErrorAlert({ erro }: FormErrorAlertProps) {
  if (!erro) return null;

  return (
    <div className="rounded-xl border border-signal-300 bg-signal-50 p-4 shadow-sm animate-fade-up">
      <div className="flex items-start gap-3">
        <XCircle className="size-5 text-signal-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-display text-xs font-bold uppercase tracking-wider text-signal-950">
            Atenção — Não foi possível realizar o cadastro
          </h4>
          <p className="text-xs font-medium leading-relaxed text-signal-800">
            {erro}
          </p>
        </div>
      </div>
    </div>
  );
}
