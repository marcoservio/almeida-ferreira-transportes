import Link from "next/link";
import { MailCheck } from "lucide-react";
import { AuthCard } from "@/components/auth/auth-card";

export const metadata = {
  title: "Cadastro realizado",
};

export default function Page() {
  return (
    <AuthCard title="Cadastro realizado">
      <div className="flex flex-col items-center text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-200">
          <MailCheck className="size-7 text-emerald-600" />
        </span>

        <p className="mt-5 leading-relaxed text-ink-600">
          Enviamos um e-mail de confirmação para você. Abra a mensagem e
          confirme o cadastro antes de fazer o primeiro login.
        </p>

        <Link
          href="/auth/login"
          className="mt-6 font-semibold text-brand-700 hover:underline"
        >
          Ir para o login
        </Link>
      </div>
    </AuthCard>
  );
}
