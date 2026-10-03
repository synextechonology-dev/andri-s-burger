"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { adicionalPorId, itemPorId } from "@/data/cardapio";

// Estado da comanda (carrinho). Fica salvo no navegador da pessoa
// para não perder o pedido se ela recarregar a página.
// Formato salvo: { alteradoEm: <ms>, linhas: [{ chave, id, adicionais, qtd, obs }] }
const ComandaCtx = createContext(null);
const CHAVE = "andris-comanda-v2";
const CHAVE_ANTIGA = "andris-comanda-v1";

// Comanda parada há mais tempo que isso começa vazia na próxima visita.
export const EXPIRA_EM_HORAS = 1;
const EXPIRA_EM_MS = EXPIRA_EM_HORAS * 60 * 60 * 1000;

// Uma linha é o lanche + os adicionais escolhidos. A ordem em que a pessoa
// marcou os adicionais não importa para identificar a linha.
export const chaveDa = (id, adicionais = []) => `${id}|${[...adicionais].sort().join(",")}`;

function carregaSalvo() {
  try {
    localStorage.removeItem(CHAVE_ANTIGA); // formato antigo (array puro): tratado como expirado
    const salvo = JSON.parse(localStorage.getItem(CHAVE) || "null");
    if (!salvo || Array.isArray(salvo) || !Array.isArray(salvo.linhas)) return null;
    if (typeof salvo.alteradoEm !== "number" || Date.now() - salvo.alteradoEm > EXPIRA_EM_MS) return null;

    // Descarta itens e adicionais que saíram do cardápio.
    const linhas = salvo.linhas
      .filter((l) => itemPorId(l?.id) && Number(l.qtd) > 0)
      .map((l) => {
        const adicionais = (Array.isArray(l.adicionais) ? l.adicionais : []).filter((a) => adicionalPorId(a));
        return { chave: chaveDa(l.id, adicionais), id: l.id, adicionais, qtd: Number(l.qtd), obs: String(l.obs ?? "") };
      });
    return { linhas: junta(linhas), alteradoEm: salvo.alteradoEm };
  } catch {
    return null;
  }
}

// Junta linhas que ficaram com a mesma chave (ex.: depois de marcar um adicional).
function junta(linhas) {
  const porChave = new Map();
  for (const l of linhas) {
    const existe = porChave.get(l.chave);
    if (!existe) {
      porChave.set(l.chave, { ...l });
      continue;
    }
    existe.qtd += l.qtd;
    if (l.obs.trim() && l.obs.trim() !== existe.obs.trim()) {
      existe.obs = existe.obs.trim() ? `${existe.obs.trim()} / ${l.obs.trim()}` : l.obs;
    }
  }
  return [...porChave.values()];
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

  // Pelo cardápio: o lanche entra (ou ganha +1) na linha sem adicionais.
  // Também é o "Mais um sem adicionais" da comanda.
  const adicionar = useCallback(
    (id) =>
      altera((atual) => {
        const chave = chaveDa(id);
        if (atual.some((l) => l.chave === chave)) {
          return atual.map((l) => (l.chave === chave ? { ...l, qtd: l.qtd + 1 } : l));
        }
        return [...atual, { chave, id, adicionais: [], qtd: 1, obs: "" }];
      }),
    [altera]
  );

  // Pelo cardápio: tira um da linha sem adicionais; se não houver, da última linha desse lanche.
  const remover = useCallback(
    (id) =>
      altera((atual) => {
        const simples = atual.find((l) => l.chave === chaveDa(id));
        const alvo = simples ?? [...atual].reverse().find((l) => l.id === id);
        if (!alvo) return atual;
        return atual.map((l) => (l === alvo ? { ...l, qtd: l.qtd - 1 } : l)).filter((l) => l.qtd > 0);
      }),
    [altera]
  );

  // Na comanda, cada ação age sobre uma linha (chave).
  const maisUm = useCallback(
    (chave) => altera((atual) => atual.map((l) => (l.chave === chave ? { ...l, qtd: l.qtd + 1 } : l))),
    [altera]
  );
  const menosUm = useCallback(
    (chave) =>
      altera((atual) => atual.map((l) => (l.chave === chave ? { ...l, qtd: l.qtd - 1 } : l)).filter((l) => l.qtd > 0)),
    [altera]
  );
  const tirar = useCallback((chave) => altera((atual) => atual.filter((l) => l.chave !== chave)), [altera]);
  const anotar = useCallback(
    (chave, obs) => altera((atual) => atual.map((l) => (l.chave === chave ? { ...l, obs } : l))),
    [altera]
  );

  // Marca ou desmarca um adicional na linha. A linha muda de chave e,
  // se já existir outra igual, as duas viram uma só.
  const alternaAdicional = useCallback(
    (chave, adicionalId) =>
      altera((atual) =>
        junta(
          atual.map((l) => {
            if (l.chave !== chave) return l;
            const adicionais = l.adicionais.includes(adicionalId)
              ? l.adicionais.filter((a) => a !== adicionalId)
              : [...l.adicionais, adicionalId];
            return { ...l, adicionais, chave: chaveDa(l.id, adicionais) };
          })
        )
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
      alternaAdicional,
      limpar,
      aberta,
      abrir,
      fechar,
    }),
    [linhas, aberta, adicionar, remover, maisUm, menosUm, tirar, anotar, alternaAdicional, limpar, abrir, fechar]
  );

  return <ComandaCtx.Provider value={valor}>{children}</ComandaCtx.Provider>;
}

export function useComanda() {
  const ctx = useContext(ComandaCtx);
  if (!ctx) throw new Error("useComanda precisa estar dentro de <ComandaProvider>");
  return ctx;
}
