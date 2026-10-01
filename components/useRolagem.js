"use client";

import { useEffect } from "react";

// Liga a rolagem da página a uma variável CSS (--p, de 0 a 1) no elemento.
// Não é animação automática: só se mexe quando a pessoa rola.
// calcula(rect, alturaJanela) devolve o progresso bruto; aqui ele é limitado a 0..1.
// Com "movimento reduzido" ligado, o progresso fica fixo em `fixo`.
export function useRolagem(ref, calcula, fixo = 1) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)");
    let quadro = 0;

    const atualiza = () => {
      quadro = 0;
      if (reduzido.matches) {
        el.style.setProperty("--p", fixo);
        return;
      }
      const p = calcula(el.getBoundingClientRect(), window.innerHeight);
      el.style.setProperty("--p", Math.min(1, Math.max(0, p)).toFixed(4));
    };
    const pede = () => {
      if (!quadro) quadro = requestAnimationFrame(atualiza);
    };

    atualiza();
    window.addEventListener("scroll", pede, { passive: true });
    window.addEventListener("resize", pede);
    reduzido.addEventListener?.("change", pede);
    return () => {
      cancelAnimationFrame(quadro);
      window.removeEventListener("scroll", pede);
      window.removeEventListener("resize", pede);
      reduzido.removeEventListener?.("change", pede);
    };
  }, [ref, calcula, fixo]);
}
