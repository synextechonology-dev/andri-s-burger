"use client";

import { useEffect, useState } from "react";
import { useComanda } from "./ComandaContext";

const links = [
  { href: "#cardapio", rotulo: "Cardápio" },
  { href: "#como-pedir", rotulo: "Como pedir" },
  { href: "#food-truck", rotulo: "O food truck" },
  { href: "#onde", rotulo: "Onde e quando" },
];

export default function Cabecalho() {
  const { quantidade, abrir } = useComanda();
  const [rolou, setRolou] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setRolou(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`cabecalho ${rolou ? "cabecalho--fixo" : ""}`}>
      <div className="cabecalho__interno">
        <a href="#inicio" className="cabecalho__marca" aria-label="Andri's Burger, voltar ao início">
          <span className="cabecalho__assinatura">Andri's</span>
          <span className="cabecalho__burger">Burger</span>
        </a>

        <nav className={`cabecalho__nav ${menu ? "is-aberto" : ""}`} aria-label="Seções do site">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setMenu(false)}>
              {l.rotulo}
            </a>
          ))}
        </nav>

        <div className="cabecalho__acoes">
          <button type="button" className="botao-comanda" onClick={abrir}>
            Comanda
            <span
              key={quantidade}
              className={`botao-comanda__qtd ${quantidade ? "is-pulo" : ""}`}
              aria-label={`${quantidade} itens`}
            >
              {quantidade}
            </span>
          </button>
          <button
            type="button"
            className="cabecalho__hamburguer"
            aria-expanded={menu}
            aria-label={menu ? "Fechar menu" : "Abrir menu"}
            onClick={() => setMenu((m) => !m)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
