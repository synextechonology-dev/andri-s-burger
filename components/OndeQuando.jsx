"use client";

import { useEffect, useState } from "react";
import { horarios, site } from "@/data/site";
import { formataHora } from "@/lib/horario";
import StatusChapa from "./StatusChapa";
import { TracoPincel } from "./Marca";

// Ordem de exibição: terça a segunda, que é como a semana do truck funciona.
const ordem = [2, 3, 4, 5, 6, 0, 1];

export default function OndeQuando() {
  const [hoje, setHoje] = useState(null);

  useEffect(() => {
    const dia = new Intl.DateTimeFormat("en-US", { timeZone: "America/Sao_Paulo", weekday: "short" }).format(new Date());
    setHoje({ Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[dia]);
  }, []);

  return (
    <section id="onde" className="secao tema-guardanapo" aria-labelledby="titulo-onde">
      <div className="secao__interno onde">
        <div className="onde__local">
          <p className="assinatura">
            <span>Chega lá</span>
            <TracoPincel />
          </p>
          <h2 id="titulo-onde" className="titulo-secao">
            Onde o truck fica
          </h2>
          <address className="onde__endereco">
            {site.endereco.rua}
            <br />
            {site.endereco.bairro}
            <br />
            {site.endereco.cidade}, {site.endereco.cep}
          </address>
          <div className="onde__acoes">
            <a className="botao botao--preto" href={site.rotaUrl} target="_blank" rel="noopener noreferrer">
              Traçar rota
            </a>
            <a className="botao botao--contorno-escuro" href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer">
              Falar no WhatsApp
            </a>
          </div>

          <figure className="mapa">
            <p className="mapa__etiqueta" aria-hidden="true">
              A Andri's tá aqui
            </p>
            <div className="mapa__moldura">
              <iframe
                className="mapa__iframe"
                src={site.mapaEmbed}
                title={`Mapa: ${site.nome} na ${site.endereco.rua}, ${site.endereco.bairro}, ${site.endereco.cidade}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <figcaption className="mapa__legenda">
              <a href={site.mapaUrl} target="_blank" rel="noopener noreferrer">
                Abrir no Google Maps
              </a>
            </figcaption>
          </figure>
        </div>

        <div className="onde__horarios">
          <h3 className="onde__subtitulo">Horário da chapa</h3>
          <StatusChapa className="status--escuro" />
          <table className="horarios">
            <caption className="sr-only">Horário de funcionamento</caption>
            <tbody>
              {ordem.map((d) => {
                const h = horarios.find((x) => x.dia === d);
                return (
                  <tr key={d} className={d === hoje ? "is-hoje" : undefined}>
                    <th scope="row">
                      {h.nome}
                      {d === hoje ? <span className="horarios__hoje">hoje</span> : null}
                    </th>
                    <td>{h.abre ? `${formataHora(h.abre)} às ${formataHora(h.fecha)}` : "Fechado"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
