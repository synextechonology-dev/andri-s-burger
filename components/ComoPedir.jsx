import { site } from "@/data/site";
import { TracoPincel } from "./Marca";

// Três passos do pedido. Texto curto, como no balcão.
const passos = [
  {
    titulo: "Escolhe",
    texto: "Toca em Adicionar no que der vontade. Quer sem tomate? Dá pra anotar em cada lanche.",
  },
  {
    titulo: "Fecha a comanda",
    texto: "Diz se vai buscar no truck ou receber em casa, e como prefere pagar.",
  },
  {
    titulo: "Manda no WhatsApp",
    texto: `O pedido abre escrito no WhatsApp da ${site.dona}. Você confere, envia e ela confirma por lá.`,
  },
];

export default function ComoPedir() {
  return (
    <section id="como-pedir" className="secao secao--curta tema-guardanapo" aria-labelledby="titulo-como">
      <div className="secao__interno">
        <header className="como__cabecalho">
          <p className="assinatura">
            <span>Sem complicação</span>
            <TracoPincel />
          </p>
          <h2 id="titulo-como" className="titulo-secao">
            Pedir é assim
          </h2>
        </header>

        <ol className="passos">
          {passos.map((p, i) => (
            <li key={p.titulo} className="passo">
              <span className="passo__numero" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="passo__titulo">{p.titulo}</h3>
              <p className="passo__texto">{p.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
