"use client";

import { useComanda } from "./ComandaContext";

// "Adicionar" vira um contador (− 1 +) depois que o item entra na comanda.
// Com opção (sabor), o contador é daquela opção.
export default function BotaoAdicionar({ item, opcao }) {
  const { qtdDe, adicionar, remover } = useComanda();
  const qtd = qtdDe(item.id, opcao);
  const nome = opcao ? `${item.nome} (${opcao})` : item.nome;

  if (qtd === 0) {
    return (
      <button type="button" className="adicionar" onClick={() => adicionar(item.id, opcao)}>
        Adicionar
        <span className="sr-only"> {nome} à comanda</span>
      </button>
    );
  }

  return (
    <div className="contador" role="group" aria-label={`${nome} na comanda`}>
      <button type="button" onClick={() => remover(item.id, opcao)} aria-label={`Tirar um ${nome}`}>
        −
      </button>
      <span aria-live="polite">{qtd}</span>
      <button type="button" onClick={() => adicionar(item.id, opcao)} aria-label={`Mais um ${nome}`}>
        +
      </button>
    </div>
  );
}
