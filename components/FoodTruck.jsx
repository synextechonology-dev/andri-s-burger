import { site } from "@/data/site";
import { Foto, TracoPincel } from "./Marca";

// Seção da casa: texto + a foto da Andriele (a única foto desta seção).
// Desktop: texto à esquerda, foto à direita. Celular: foto em cima, texto embaixo.
const foto = {
  src: "/fotos/food-truck/andriele.jpg",
  alt: "Andriele, dona da Andri's Burger",
  temFoto: true,
  proporcao: "4 / 5",
};

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

        <figure className="truck-sobre__retrato">
          <Foto
            src={foto.src}
            alt={foto.alt}
            temFoto={foto.temFoto}
            proporcao={foto.proporcao}
            className="truck-sobre__foto"
            sizes="(max-width: 960px) min(100vw, 440px), 440px"
          />
        </figure>
      </div>
    </section>
  );
}
