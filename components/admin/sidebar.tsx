"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Truck, 
  MapPin, 
  Fuel, 
  Wrench, 
  FileCheck2, 
  DollarSign, 
  Users, 
  BellRing, 
  ShieldAlert,
  ArrowLeft,
  Building2,
  Layers
} from "lucide-react";
import { Logo } from "@/components/site/logo";
import { cn } from "@/lib/utils";

const menuItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Gestão de Viagens", href: "/admin/viagens", icon: MapPin },
  { label: "Veículos (CRLV)", href: "/admin/frota", icon: Truck },
  { label: "Conjuntos (Frota)", href: "/admin/conjuntos", icon: Layers },
  { label: "Acerto de Viagem", href: "/admin/acertos", icon: DollarSign },
  { label: "Abastecimentos", href: "/admin/abastecimentos", icon: Fuel },
  { label: "Manutenção", href: "/admin/manutencoes", icon: Wrench },
  { label: "Postos Parceiros", href: "/admin/postos", icon: Building2 },
  { label: "Multas de Trânsito", href: "/admin/multas", icon: ShieldAlert },
  { label: "Motoristas", href: "/admin/motoristas", icon: Users },
  { label: "Alertas & Notificações", href: "/admin/alertas", icon: BellRing },
  { label: "Usuários ADM", href: "/admin/usuarios", icon: FileCheck2 },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-ink-800 bg-ink-950 text-white transition-transform">
      {/* Topo / Logo */}
      <div className="flex h-20 items-center justify-between border-b border-ink-800 px-6">
        <Logo size="md" href="/admin/dashboard" />
      </div>

      {/* Rótulo do Painel */}
      <div className="bg-ink-900/60 px-6 py-2.5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-signal-500">
          Painel de Gestão
        </p>
      </div>

      {/* Lista de Navegação */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all",
                isActive
                  ? "bg-signal-500 text-white shadow-glow"
                  : "text-ink-300 hover:bg-ink-900 hover:text-white"
              )}
            >
              <Icon className={cn("size-5 shrink-0", isActive ? "text-white" : "text-ink-400")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Voltar ao Site Institucional */}
      <div className="border-t border-ink-800 p-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl border border-white/10 px-3.5 py-2.5 text-xs font-semibold text-ink-300 transition-colors hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft className="size-4" />
          <span>Voltar ao Site</span>
        </Link>
      </div>
    </aside>
  );
}
