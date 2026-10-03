import { adicionais, categorias, itensDa, pao } from "@/data/cardapio";
import { Faiscas, Foto, Preco, TracoPincel } from "./Marca";
import BotaoAdicionar from "./BotaoAdicionar";
import { Batata, BurgerMontado } from "./Ilustracoes";
import LinhaComOpcoes from "./LinhaComOpcoes";

const maiuscula = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1);
const juntaIngredientes = (lista) =>
  maiuscula(lista.length > 1 ? `${lista.slice(0, -1).join(", ")} e ${lista.at(-1)}.` : `${lista[0]}.`);

// Quadro informativo dos adicionais. A escolha acontece na comanda, em cada lanche.
function Turbine() {
  return (
    <aside className="turbine" aria-labelledby="titulo-turbine">
      <div className="turbine__topo">
        <h3 id="titulo-turbine" className="turbine__titulo">
          <Faiscas />
          Turbine seu lanche
          <Faiscas lado="direita" />
        </h3>
        <p className="turbine__apoio">Vale pra qualquer lanche, clássico ou especial. Você escolhe na comanda.</p>
      </div>
      <ul className="turbine__lista">
        {adicionais.map((a) => (
          <li key={a.id} className="turbine__item">
            <span className="turbine__nome">{a.nome}</span>
            <Preco valor={a.preco} />
          </li>
        ))}
      </ul>
    </aside>
  );
}

// Navegação entre as partes do cardápio. Gruda no topo enquanto a pessoa rola.
function AbasCardapio() {
  return (
    <nav className="abas" aria-label="Partes do cardápio">
      <div className="abas__trilho">
        {categorias.map((c) => (
          <a key={c.id} href={`#${c.id}`} className="abas__aba">
            {c.nome}
          </a>
        ))}
      </div>
    </nav>
  );
}

// Linha de lanche no padrão do cardápio do manual:
// nome em Bebas, ingredientes em Barlow, preço em amarelo à direita.
function LinhaLanche({ item, numero }) {
  return (
    <li className="lanche">
      <Foto
        src={item.foto}
        temFoto={item.temFoto}
        alt={`Foto do ${item.nome}`}
        proporcao="1 / 1"
        className="lanche__foto"
        reserva={<span className="lanche__numero">{String(numero).padStart(2, "0")}</span>}
      />
      <div className="lanche__corpo">
        <div className="lanche__topo">
          <h3 className="lanche__nome">{item.nome}</h3>
          <Preco valor={item.preco} />
        </div>
        <p className="lanche__ingredientes">{juntaIngredientes(item.ingredientes)}</p>
        <BotaoAdicionar item={item} />
      </div>
    </li>
  );
}

function Especial({ item }) {
  return (
    <article className="especial">
      <Foto
        src={item.foto}
        temFoto={item.temFoto}
        alt={`Foto do ${item.nome}`}
        proporcao="5 / 4"
        className="especial__foto"
        reserva={<BurgerMontado camadas={item.camadas?.map((c) => c.tipo)} />}
      />
      <div className="especial__selo" aria-hidden="true">
        <Preco valor={item.preco} />
      </div>
      <div className="especial__corpo">
        <p className="especial__chamada">{item.destaque}</p>
        <h3 className="especial__nome">{item.nome}</h3>
        <p className="especial__ingredientes">{juntaIngredientes(item.ingredientes)}</p>
        <div className="especial__rodape">
          <span className="sr-only">
            <Preco valor={item.preco} />
          </span>
          <BotaoAdicionar item={item} />
        </div>
      </div>
    </article>
  );
}

// Linha simples (porções e bebidas): nome, detalhe e preço, com pontilhado no meio.
function LinhaSimples({ item }) {
  if (item.opcoes?.length) return <LinhaComOpcoes item={item} />;
  return (
    <li className="linha">
      <div className="linha__texto">
        <span className="linha__nome">{item.nome}</span>
        {item.detalhe ? <span className="linha__detalhe">{item.detalhe}</span> : null}
      </div>
      <span className="linha__pontilhado" aria-hidden="true" />
      <Preco valor={item.preco} />
      <BotaoAdicionar item={item} />
    </li>
  );
}

export default function Cardapio() {
  const classicos = itensDa("classicos");
  const especiais = itensDa("especiais");
  const porcoes = itensDa("porcoes");
  const bebidas = itensDa("bebidas");

  return (
    <div id="cardapio" className="cardapio">
      <AbasCardapio />

      <section id="classicos" className="secao tema-preto" aria-labelledby="titulo-classicos">
        <div className="secao__interno">
          <header className="cardapio__cabecalho">
            <p className="assinatura">
              <span>Cardápio</span>
              <TracoPincel />
            </p>
            <h2 id="titulo-classicos" className="titulo-secao">
              Clássicos
            </h2>
            <p className="destaque-pao">
              <Faiscas />
              <span>{pao}</span>
              <Faiscas lado="direita" />
            </p>
            <p className="secao__apoio">
              Os de sempre. Do {classicos[0].nome} ao {classicos.at(-1).nome}, é só escolher e tocar em Adicionar.
            </p>
          </header>
          <ul className="lanches">
            {classicos.map((item, i) => (
              <LinhaLanche key={item.id} item={item} numero={i + 1} />
            ))}
          </ul>
          <Turbine />
        </div>
      </section>

      <section id="especiais" className="secao tema-carvao" aria-labelledby="titulo-especiais">
        <div className="secao__interno">
          <h2 id="titulo-especiais" className="titulo-secao titulo-secao--faiscas">
            <Faiscas />
            Especiais da casa
            <Faiscas lado="direita" />
          </h2>
          <p className="secao__apoio especiais__apoio">Os dois que a casa assina embaixo.</p>
          <div className="especiais">
            {especiais.map((item) => (
              <Especial key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section id="porcoes" className="secao tema-guardanapo" aria-labelledby="titulo-porcoes">
        <div className="secao__interno secao__interno--dividido">
          <div>
            <h2 id="titulo-porcoes" className="titulo-secao">
              Porções
            </h2>
            <p className="secao__apoio">Pra acompanhar o lanche ou dividir com alguém.</p>
            <ul className="linhas">
              {porcoes.map((item) => (
                <LinhaSimples key={item.id} item={item} />
              ))}
            </ul>
          </div>
          <Foto
            src="/fotos/lanches/batata-queijo-bacon.jpg"
            alt="Foto da batata com queijo e bacon"
            proporcao="4 / 5"
            className="porcoes__foto"
            reserva={<Batata />}
          />
        </div>
      </section>

      <section id="bebidas" className="secao tema-amarelo gergelim" aria-labelledby="titulo-bebidas">
        <div className="secao__interno">
          <div className="quadro-bebidas tema-preto">
            <h2 id="titulo-bebidas" className="titulo-secao">
              Bebidas
            </h2>
            <p className="secao__apoio">Pra acompanhar o lanche.</p>
            <ul className="linhas">
              {bebidas.map((item) => (
                <LinhaSimples key={item.id} item={item} />
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
