"use client";

import { useRef } from "react";
import { site } from "@/data/site";
import { Faiscas } from "./Marca";
import { useRolagem } from "./useRolagem";

// Duas faixas de texto que deslizam em sentidos opostos conforme a rolagem.
const progresso = (r, h) => (h - r.top) / (h + r.height);

const frases = ["Feito na chapa", site.textos.slogan.replace("!", ""), "Peça o seu", site.cidade];

function Fileira({ classe }) {
  const repetidas = [...frases, ...frases, ...frases];
  return (
    <div className={`letreiro__fileira ${classe}`} aria-hidden="true">
      {repetidas.map((f, i) => (
        <span key={i} className="letreiro__item">
          {f}
          <Faiscas className="letreiro__faisca" />
        </span>
      ))}
    </div>
  );
}

export default function Letreiro() {
  const ref = useRef(null);
  useRolagem(ref, progresso, 0.5);

  return (
    <section ref={ref} className="letreiro tema-amarelo" aria-label={site.textos.slogan}>
      <Fileira classe="letreiro__fileira--ida" />
      <div className="letreiro__fita tema-preto">
        <Fileira classe="letreiro__fileira--volta" />
      </div>
    </section>
  );
}
