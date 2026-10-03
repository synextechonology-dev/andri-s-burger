"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { aceitaAdicionais, adicionalPorId, itemPorId } from "@/data/cardapio";

// Estado da comanda (carrinho). Fica salvo no navegador da pessoa
// para não perder o pedido se ela recarregar a página.
// Formato salvo: { alteradoEm: <ms>, linhas: [{ uid, id, qtd, adicionais, obs }] }
//
// Como as linhas funcionam:
// - Lanche (clássicos e especiais): cada lanche é uma linha própria (qtd sempre 1),
//   com seus adicionais e sua observação. Assim dá pra pedir "um com bacon, um sem tomate".
// - Porções e bebidas: uma linha por item, com quantidade (− 2 +).
const ComandaCtx = createContext(null);
const CHAVE = "andris-comanda-v2";
const CHAVE_ANTIGA = "andris-comanda-v1";

// Comanda parada há mais tempo que isso começa vazia na próxima visita.
export const EXPIRA_EM_HORAS = 1;
const EXPIRA_EM_MS = EXPIRA_EM_HORAS * 60 * 60 * 1000;

let contador = 0;
const novoUid = () => `${Date.now().toString(36)}-${(contador++).toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

const ehLanche = (id) => aceitaAdicionais(itemPorId(id));
const linhaLanche = (id, adicionais = [], obs = "") => ({ uid: novoUid(), id, qtd: 1, adicionais, obs });

// Confere e arruma o que veio do localStorage. Itens e adicionais que saíram
// do cardápio somem; lanche com qtd > 1 vira uma linha por lanche.
function normaliza(linhasSalvas) {
  const linhas = [];
  for (const l of linhasSalvas) {
    const qtd = Math.floor(Number(l?.qtd));
    if (!itemPorId(l?.id) || !(qtd > 0)) continue;
    if (ehLanche(l.id)) {
      const adicionais = (Array.isArray(l.adicionais) ? l.adicionais : []).filter((a) => adicionalPorId(a));
      for (let i = 0; i < qtd; i++) linhas.push(linhaLanche(l.id, [...adicionais], String(l.obs ?? "")));
    } else {
      const existe = linhas.find((x) => x.id === l.id);
      if (existe) existe.qtd += qtd;
      else linhas.push({ uid: novoUid(), id: l.id, qtd, adicionais: [], obs: "" });
    }
  }
  return linhas;
}

function carregaSalvo() {
  try {
    localStorage.removeItem(CHAVE_ANTIGA); // formato antigo (array puro): tratado como expirado
    const salvo = JSON.parse(localStorage.getItem(CHAVE) || "null");
    if (!salvo || Array.isArray(salvo) || !Array.isArray(salvo.linhas)) return null;
    if (typeof salvo.alteradoEm !== "number" || Date.now() - salvo.alteradoEm > EXPIRA_EM_MS) return null;
    return { linhas: normaliza(salvo.linhas), alteradoEm: salvo.alteradoEm };
  } catch {
    return null;
  }
}

export function ComandaProvider({ children }) {
  const [estado, setEstado] = useState({ linhas: [], alteradoEm: 0 });
  const [aberta, setAberta] = useState(false);
  const [carregou, setCarregou] = useState(false);
  const { linhas } = estado;

  useEffect(() => {
    const salvo = carregaSalvo();
    if (salvo) setEstado(salvo);
    setCarregou(true);
  }, []);

  useEffect(() => {
    if (!carregou) return;
    try {
      if (estado.linhas.length) localStorage.setItem(CHAVE, JSON.stringify(estado));
      else localStorage.removeItem(CHAVE);
    } catch {}
  }, [estado, carregou]);

  // Toda alteração passa por aqui e renova a data da última alteração.
  const altera = useCallback((fn) => {
    setEstado((atual) => ({ linhas: fn(atual.linhas), alteradoEm: Date.now() }));
  }, []);

  // Pelo cardápio (1 toque): lanche entra como linha nova; porção/bebida ganha +1.
  const adicionar = useCallback(
    (id) =>
      altera((atual) => {
        if (ehLanche(id)) return [...atual, linhaLanche(id)];
        if (atual.some((l) => l.id === id)) return atual.map((l) => (l.id === id ? { ...l, qtd: l.qtd + 1 } : l));
        return [...atual, { uid: novoUid(), id, qtd: 1, adicionais: [], obs: "" }];
      }),
    [altera]
  );

  // Pelo cardápio (−): no lanche, tira primeiro o último que está sem adicional
  // e sem observação, pra não apagar o que a pessoa já personalizou.
  const remover = useCallback(
    (id) =>
      altera((atual) => {
        const doItem = atual.filter((l) => l.id === id);
        if (!doItem.length) return atual;
        if (!ehLanche(id)) {
          return atual.map((l) => (l.id === id ? { ...l, qtd: l.qtd - 1 } : l)).filter((l) => l.qtd > 0);
        }
        const simples = [...doItem].reverse().find((l) => !l.adicionais.length && !l.obs.trim());
        const alvo = simples ?? doItem.at(-1);
        return atual.filter((l) => l.uid !== alvo.uid);
      }),
    [altera]
  );

  // Na comanda, cada ação age sobre uma linha (uid).
  const maisUm = useCallback(
    (uid) => altera((atual) => atual.map((l) => (l.uid === uid ? { ...l, qtd: l.qtd + 1 } : l))),
    [altera]
  );
  const menosUm = useCallback(
    (uid) => altera((atual) => atual.map((l) => (l.uid === uid ? { ...l, qtd: l.qtd - 1 } : l)).filter((l) => l.qtd > 0)),
    [altera]
  );
  const tirar = useCallback((uid) => altera((atual) => atual.filter((l) => l.uid !== uid)), [altera]);
  const anotar = useCallback(
    (uid, obs) => altera((atual) => atual.map((l) => (l.uid === uid ? { ...l, obs } : l))),
    [altera]
  );

  // "Repetir": mais um lanche igualzinho (mesmos adicionais e observação), logo abaixo.
  const repetir = useCallback(
    (uid) =>
      altera((atual) => {
        const i = atual.findIndex((l) => l.uid === uid);
        if (i < 0) return atual;
        const copia = linhaLanche(atual[i].id, [...atual[i].adicionais], atual[i].obs);
        return [...atual.slice(0, i + 1), copia, ...atual.slice(i + 1)];
      }),
    [altera]
  );

  // Marca ou desmarca um adicional (cada um uma vez por lanche).
  const alternaAdicional = useCallback(
    (uid, adicionalId) =>
      altera((atual) =>
        atual.map((l) => {
          if (l.uid !== uid) return l;
          const adicionais = l.adicionais.includes(adicionalId)
            ? l.adicionais.filter((a) => a !== adicionalId)
            : [...l.adicionais, adicionalId];
          return { ...l, adicionais };
        })
      ),
    [altera]
  );

  const limpar = useCallback(() => setEstado({ linhas: [], alteradoEm: Date.now() }), []);
  const abrir = useCallback(() => setAberta(true), []);
  const fechar = useCallback(() => setAberta(false), []);

  const valor = useMemo(
    () => ({
      linhas,
      quantidade: linhas.reduce((s, l) => s + l.qtd, 0),
      qtdDe: (id) => linhas.filter((l) => l.id === id).reduce((s, l) => s + l.qtd, 0),
      adicionar,
      remover,
      maisUm,
      menosUm,
      tirar,
      anotar,
      repetir,
      alternaAdicional,
      limpar,
      aberta,
      abrir,
      fechar,
    }),
    [linhas, aberta, adicionar, remover, maisUm, menosUm, tirar, anotar, repetir, alternaAdicional, limpar, abrir, fechar]
  );

  return <ComandaCtx.Provider value={valor}>{children}</ComandaCtx.Provider>;
}

export function useComanda() {
  const ctx = useContext(ComandaCtx);
  if (!ctx) throw new Error("useComanda precisa estar dentro de <ComandaProvider>");
  return ctx;
}
