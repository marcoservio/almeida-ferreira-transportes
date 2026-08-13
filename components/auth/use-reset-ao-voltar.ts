"use client";

import { useEffect, useRef } from "react";

/**
 * Reabilita um formulário quando a página é restaurada pelo navegador.
 *
 * Botões ficam `disabled` enquanto a navegação acontece. Se o usuário voltar
 * pelo histórico, o navegador restaura a página do cache (bfcache) com o estado
 * do React congelado — e o botão continuaria travado até um F5.
 * O evento `pageshow` dispara nessa restauração (e no carregamento normal),
 * então é o gancho certo para destravar.
 */
export function useResetAoVoltar(reset: () => void) {
  // Guarda a função numa ref para o listener não ser re-registrado a cada render.
  const resetRef = useRef(reset);
  resetRef.current = reset;

  useEffect(() => {
    const handler = () => resetRef.current();
    window.addEventListener("pageshow", handler);
    return () => window.removeEventListener("pageshow", handler);
  }, []);
}
