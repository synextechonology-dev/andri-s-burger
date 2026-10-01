import { site } from "@/data/site";
import { Foto, TracoPincel } from "./Marca";
import { Truck } from "./Ilustracoes";

// Fotos do food truck. Troque temFoto para true quando o arquivo estiver em /public.
const fotos = [
  { src: "/fotos/food-truck/truck.jpg", alt: "O food truck da Andri's Burger", legenda: null, temFoto: false, classe: "galeria__item--largo", proporcao: "16 / 9" },
  { src: "/fotos/food-truck/janela.jpg", alt: "A janela de atendimento", legenda: "A janela", temFoto: false, classe: "", proporcao: "4 / 5" },
  { src: "/fotos/food-truck/chapa.jpg", alt: "Lanche na chapa", legenda: "A chapa", temFoto: false, classe: "", proporcao: "4 / 5" },
  { src: "/fotos/food-truck/andriele.jpg", alt: "Andriele, a dona", legenda: "A Andriele", temFoto: false, classe: "", proporcao: "4 / 5" },
];

export default function FoodTruck() {
  return (
    <section id="food-truck" className="secao tema-preto" aria-labelledby="titulo-truck">
      <div className="secao__interno truck-sobre">
        <div className="truck-sobre__texto">
          <p className="assinatura">
            <span>Da casa</span>
            <TracoPincel />
          </p>
          <h2 id="titulo-truck" className="titulo-secao">
            Tem nome e sobrenome
          </h2>
          <p>
            A {site.nome} é o food truck da {site.dona}, em {site.endereco.cidade.replace(", SC", "")}. A assinatura
            no logo é escrita à mão porque aqui é assim: feito por gente.
          </p>
          <p>
            Dá pra pedir direto na janela, mandar o pedido pelo site e passar pra buscar, ou receber em casa. Do jeito
            que ficar melhor pra você.
          </p>
          <p className="truck-sobre__dona">
            <span className="truck-sobre__nome">{site.dona}</span>
            <span>Dona da Andri's</span>
          </p>
        </div>

        <div className="galeria">
          {fotos.map((f, i) => (
            <Foto
              key={f.src}
              src={f.src}
              alt={f.alt}
              temFoto={f.temFoto}
              proporcao={f.proporcao}
              className={`galeria__item ${f.classe}`}
              legenda={f.legenda}
              reserva={i === 0 ? <Truck /> : null}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
