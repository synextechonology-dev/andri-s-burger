"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/site";
import { situacaoAgora } from "@/lib/horario";
import { Faiscas, TracoPincel } from "./Marca";
import StatusChapa from "./StatusChapa";
import { useComanda } from "./ComandaContext";

// Placa de neon na janela: acesa quando a chapa está ligada (pelo horário).
// O brilho é fixo; não pisca sozinho.
function Neon() {
  const [aberto, setAberto] = useState(null);

  useEffect(() => {
    const atualiza = () => setAberto(situacaoAgora().aberto);
    atualiza();
    const t = setInterval(atualiza, 60_000);
    return () => clearInterval(t);
  }, []);

  return (
    <p className={`neon ${aberto ? "neon--aceso" : ""}`} aria-hidden="true">
      <span className="neon__linha">Chapa</span>
      <span className="neon__linha neon__linha--grande">{aberto === null ? " " : aberto ? "Ligada" : "Desligada"}</span>
    </p>
  );
}

// A primeira dobra é a janela do food truck, com toldo listrado.
// Na primeira visita, a porta de enrolar sobe e revela a chapa.
// Quem volta ao site já encontra a janela aberta.
export default function Abertura() {
  const { abrir } = useComanda();
  const [jaVeio, setJaVeio] = useState(false);
  const [carimbos, setCarimbos] = useState(0);

  useEffect(() => {
    try {
      if (localStorage.getItem("andris-ja-veio")) setJaVeio(true);
      else localStorage.setItem("andris-ja-veio", "1");
    } catch {}
  }, []);

  return (
    <section id="inicio" className={`abertura tema-preto ${jaVeio ? "abertura--ja-veio" : ""}`}>
      <div className="truck">
        <div className="truck__faixa">
          <span className="truck__faixa-texto">Feito na chapa</span>
        </div>
        <div className="toldo" aria-hidden="true" />

        <div className="truck__janela">
          <div className="truck__luz" aria-hidden="true" />
          <Neon />

          <div className="truck__conteudo">
            {/* Tocar no selo carimba de novo. Um detalhe só pra quem é curioso. */}
            <button
              type="button"
              className="truck__carimbar"
              onClick={() => setCarimbos((n) => n + 1)}
              aria-label="Carimbar o selo da Andri's Burger"
            >
              <img
                key={carimbos}
                className={`truck__selo ${carimbos ? "truck__selo--de-novo" : ""}`}
                src="/marca/selo-recortado.png"
                alt=""
                width="640"
                height="640"
                fetchPriority="high"
              />
            </button>

            <div className="truck__texto">
              <p className="truck__assinatura">
                <span>Chega mais</span>
                <TracoPincel />
              </p>
              <h1 className="truck__titulo">
                <span className="sr-only">{site.nome}: </span>
                {site.textos.slogan}
              </h1>
              <p className="truck__apoio">
                Hambúrguer de chapa num food truck em {site.endereco.cidade.replace(", SC", "")}. Escolhe o
                lanche, monta a comanda aqui e o pedido chega escrito no WhatsApp da {site.dona}.{" "}
                <strong>Sem app, sem cadastro.</strong>
              </p>

              <div className="truck__acoes">
                <a href="#cardapio" className="botao botao--amarelo">
                  <Faiscas className="botao__faisca" />
                  {site.textos.pedido}
                  <Faiscas lado="direita" className="botao__faisca" />
                </a>
                <button type="button" className="botao botao--contorno" onClick={abrir}>
                  Ver minha comanda
                </button>
              </div>
            </div>
          </div>

          {/* Porta de enrolar: sobe uma vez, na primeira visita */}
          <div className="porta" aria-hidden="true">
            <span className="porta__aviso">Abrindo a chapa</span>
            <span className="porta__puxador" />
          </div>
        </div>

        <div className="truck__balcao">
          <StatusChapa />
          <span className="truck__balcao-info">Retira no truck ou recebe em casa</span>
        </div>
      </div>

      <a href="#anatomia" className="abertura__rolar">
        <span>Rola pra ver</span>
        <span className="abertura__seta" aria-hidden="true" />
      </a>
    </section>
  );
}
