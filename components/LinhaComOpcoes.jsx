"use client";

import { useId, useState } from "react";
import { Preco } from "./Marca";
import BotaoAdicionar from "./BotaoAdicionar";

// Linha do cardápio com opções (ex.: sabor do refrigerante).
// A pessoa escolhe a opção nos chips e depois toca em Adicionar; a primeira já vem marcada.
export default function LinhaComOpcoes({ item }) {
  const [opcao, setOpcao] = useState(item.opcoes[0]);
  const grupo = useId();

  return (
    <li className="linha linha--opcoes">
      <div className="linha__texto">
        <span className="linha__nome">{item.nome}</span>
        {item.detalhe ? <span className="linha__detalhe">{item.detalhe}</span> : null}
      </div>
      <span className="linha__pontilhado" aria-hidden="true" />
      <Preco valor={item.preco} />
      <BotaoAdicionar item={item} opcao={opcao} />

      <fieldset className="chips">
        <legend className="sr-only">
          {item.rotuloOpcoes ?? "Opção"} do {item.nome}
        </legend>
        {item.opcoes.map((o) => (
          <label key={o} className={`chip ${o === opcao ? "is-marcado" : ""}`}>
            <input type="radio" name={grupo} value={o} checked={o === opcao} onChange={() => setOpcao(o)} />
            <span>{o}</span>
          </label>
        ))}
      </fieldset>
    </li>
  );
}
