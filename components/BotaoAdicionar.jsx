"use client";

import { useComanda } from "./ComandaContext";

// "Adicionar" vira um contador (− 1 +) depois que o item entra na comanda.
export default function BotaoAdicionar({ item }) {
  const { qtdDe, adicionar, remover } = useComanda();
  const qtd = qtdDe(item.id);

  if (qtd === 0) {
    return (
      <button type="button" className="adicionar" onClick={() => adicionar(item.id)}>
        Adicionar
        <span className="sr-only"> {item.nome} à comanda</span>
      </button>
    );
  }

  return (
    <div className="contador" role="group" aria-label={`${item.nome} na comanda`}>
      <button type="button" onClick={() => remover(item.id)} aria-label={`Tirar um ${item.nome}`}>
        −
      </button>
      <span aria-live="polite">{qtd}</span>
      <button type="button" onClick={() => adicionar(item.id)} aria-label={`Mais um ${item.nome}`}>
        +
      </button>
    </div>
  );
}
