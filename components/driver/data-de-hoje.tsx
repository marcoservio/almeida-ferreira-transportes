"use client";

import { useEffect, useState } from "react";

const formato = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

/**
 * Data de hoje calculada no navegador — usa o fuso do motorista e evita
 * o erro de pré-renderização com valores instáveis (`new Date()`) do Next.
 */
export function DataDeHoje() {
  const [data, setData] = useState("");

  useEffect(() => {
    setData(formato.format(new Date()));
  }, []);

  // Reserva a largura do texto para o layout não "pular" ao hidratar.
  return <span className="min-w-[8rem]">{data || " "}</span>;
}
