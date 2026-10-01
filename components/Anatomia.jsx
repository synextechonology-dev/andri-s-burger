"use client";

import { useRef } from "react";
import { itemPorId } from "@/data/cardapio";
import { site } from "@/data/site";
import { Camada } from "./Ilustracoes";
import { Faiscas, Preco, TracoPincel } from "./Marca";
import BotaoAdicionar from "./BotaoAdicionar";
import { useRolagem } from "./useRolagem";

// "Camada por camada": o Andri's Burger se abre conforme a pessoa rola a página.
// O palco gruda na tela enquanto a seção passa; --p vai de 0 (montado) a 1 (aberto).
const progresso = (r, h) => (h * 0.35 - r.top) / Math.max(1, (r.height - h) * 0.7 + h * 0.35);

export default function Anatomia() {
  const ref = useRef(null);
  useRolagem(ref, progresso);

  const item = itemPorId("andris-burger");
  const camadas = item.camadas;
  const centro = (camadas.length - 1) / 2;
  let lado = 0;

  return (
    <section id="anatomia" ref={ref} className="anatomia tema-carvao gergelim-suave" aria-labelledby="titulo-anatomia">
      <div className="anatomia__palco">
        <div className="anatomia__texto">
          <p className="assinatura">
            <span>De perto</span>
            <TracoPincel />
          </p>
          <h2 id="titulo-anatomia" className="titulo-secao">
            Camada por camada
          </h2>
          <p className="anatomia__chamada">{site.textos.chamada}</p>
          <p className="secao__apoio anatomia__apoio">
            Esse é o {item.nome}, o lanche que leva o nome da casa. Rola devagar e vê o que vai dentro.
          </p>

          <div className="anatomia__compra">
            <div className="anatomia__preco">
              <Faiscas />
              <Preco valor={item.preco} />
            </div>
            <BotaoAdicionar item={item} />
          </div>
        </div>

        <ul className="anatomia__burger" aria-label={`O que vai no ${item.nome}`}>
          {camadas.map((c, i) => {
            const temRotulo = Boolean(c.rotulo);
            const ladoAtual = temRotulo ? (lado++ % 2 === 0 ? "esq" : "dir") : null;
            return (
              <li
                key={i}
                className={`anatomia__camada ${ladoAtual ? `anatomia__camada--${ladoAtual}` : ""}`}
                style={{ "--d": i - centro, "--i": i }}
                aria-hidden={temRotulo ? undefined : true}
              >
                <Camada tipo={c.tipo} />
                {temRotulo ? <span className="anatomia__rotulo">{c.rotulo}</span> : null}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
