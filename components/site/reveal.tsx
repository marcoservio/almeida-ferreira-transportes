"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Anima o conteúdo quando ele entra na tela.
 * Sem JS habilitado (ou sem IntersectionObserver) o conteúdo aparece normalmente.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  /** Atraso em milissegundos, para escalonar itens de uma lista. */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={visible ? { animationDelay: `${delay}ms` } : undefined}
      className={cn(
        visible ? "animate-fade-up" : "opacity-0 motion-reduce:opacity-100",
        className,
      )}
    >
      {children}
    </div>
  );
}
