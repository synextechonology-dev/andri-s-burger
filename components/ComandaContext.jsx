"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

// Estado da comanda (carrinho). Fica salvo no navegador da pessoa
// para não perder o pedido se ela recarregar a página.
const ComandaCtx = createContext(null);
const CHAVE = "andris-comanda-v1";

export function ComandaProvider({ children }) {
  const [linhas, setLinhas] = useState([]); // [{ id, qtd, obs }]
  const [aberta, setAberta] = useState(false);
  const [carregou, setCarregou] = useState(false);

  useEffect(() => {
    try {
      const salvo = JSON.parse(localStorage.getItem(CHAVE) || "[]");
      if (Array.isArray(salvo)) setLinhas(salvo);
    } catch {}
    setCarregou(true);
  }, []);

  useEffect(() => {
    if (!carregou) return;
    try {
      localStorage.setItem(CHAVE, JSON.stringify(linhas));
    } catch {}
  }, [linhas, carregou]);

  const adicionar = useCallback((id) => {
    setLinhas((atual) => {
      const existe = atual.find((l) => l.id === id);
      if (existe) return atual.map((l) => (l.id === id ? { ...l, qtd: l.qtd + 1 } : l));
      return [...atual, { id, qtd: 1, obs: "" }];
    });
  }, []);

  const remover = useCallback((id) => {
    setLinhas((atual) =>
      atual
        .map((l) => (l.id === id ? { ...l, qtd: l.qtd - 1 } : l))
        .filter((l) => l.qtd > 0)
    );
  }, []);

  const tirar = useCallback((id) => setLinhas((atual) => atual.filter((l) => l.id !== id)), []);

  const anotar = useCallback((id, obs) => {
    setLinhas((atual) => atual.map((l) => (l.id === id ? { ...l, obs } : l)));
  }, []);

  const limpar = useCallback(() => setLinhas([]), []);

  const valor = useMemo(
    () => ({
      linhas,
      quantidade: linhas.reduce((s, l) => s + l.qtd, 0),
      qtdDe: (id) => linhas.find((l) => l.id === id)?.qtd ?? 0,
      adicionar,
      remover,
      tirar,
      anotar,
      limpar,
      aberta,
      abrir: () => setAberta(true),
      fechar: () => setAberta(false),
    }),
    [linhas, aberta, adicionar, remover, tirar, anotar, limpar]
  );

  return <ComandaCtx.Provider value={valor}>{children}</ComandaCtx.Provider>;
}

export function useComanda() {
  const ctx = useContext(ComandaCtx);
  if (!ctx) throw new Error("useComanda precisa estar dentro de <ComandaProvider>");
  return ctx;
}
