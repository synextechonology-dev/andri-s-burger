"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { aceitaAdicionais, adicionais, adicionalPorId, itemPorId } from "@/data/cardapio";
import { linkWhatsApp, montaMensagem, reais, subtotal, validaPedido, valorLinha } from "@/lib/pedido";
import { useComanda } from "./ComandaContext";
import { TracoPincel } from "./Marca";

const vazio = {
  nome: "",
  tipo: "",
  rua: "",
  bairro: "",
  complemento: "",
  quando: "pronto",
  horario: "",
  pagamento: "",
  troco: "",
  observacoes: "",
};

function Opcao({ nome, valor, atual, onChange, children }) {
  return (
    <label className={`opcao ${atual === valor ? "is-marcada" : ""}`}>
      <input type="radio" name={nome} value={valor} checked={atual === valor} onChange={() => onChange(valor)} />
      <span>{children}</span>
    </label>
  );
}

function Erro({ texto }) {
  if (!texto) return null;
  return (
    <p className="campo__erro" role="alert">
      {texto}
    </p>
  );
}

// Lanche na comanda: uma linha por lanche, com adicionais e observação próprios.
// Os adicionais ficam recolhidos para a comanda não ficar comprida no celular.
function LinhaLanche({ linha, item, ordem }) {
  const { tirar, repetir, anotar, alternaAdicional } = useComanda();
  const [aberto, setAberto] = useState(false);
  const escolhidos = linha.adicionais.map(adicionalPorId).filter(Boolean);
  const personalizado = escolhidos.length > 0 || linha.obs.trim() !== "";
  const nome = ordem ? `${item.nome} (${ordem})` : item.nome;
  const painelId = `ajustes-${linha.uid}`;

  return (
    <li className={`ticket__item ${aberto ? "is-aberto" : ""}`}>
      <div className="ticket__item-linha">
        <span className="ticket__nome">
          {item.nome}
          {ordem ? <span className="ticket__ordem">{ordem}</span> : null}
        </span>
        <span className="ticket__valor">{reais(valorLinha(linha))}</span>
        <button type="button" className="ticket__tirar" onClick={() => tirar(linha.uid)} aria-label={`Tirar ${nome}`}>
          ×
        </button>
      </div>

      {personalizado && !aberto ? (
        <p className="ticket__resumo">
          {escolhidos.length ? <span>+ {escolhidos.map((a) => a.nome).join(", ")}</span> : null}
          {linha.obs.trim() ? <span className="ticket__resumo-obs">“{linha.obs.trim()}”</span> : null}
        </p>
      ) : null}

      <div className="ticket__item-acoes">
        <button
          type="button"
          className={`ajustar ${aberto ? "is-aberto" : ""}`}
          aria-expanded={aberto}
          aria-controls={painelId}
          onClick={() => setAberto((a) => !a)}
        >
          {aberto ? "Pronto" : personalizado ? "Editar" : "+ Adicionais ou ajuste"}
          <span className="sr-only"> do {nome}</span>
        </button>
        <button type="button" className="ticket__link" onClick={() => repetir(linha.uid)}>
          Mais um igual<span className="sr-only"> ao {nome}</span>
        </button>
      </div>

      {aberto ? (
        <div id={painelId} className="ajustes">
          <fieldset className="extras">
            <legend className="extras__titulo">Adicionais</legend>
            <div className="extras__lista">
              {adicionais.map((a) => {
                const marcado = linha.adicionais.includes(a.id);
                return (
                  <button
                    key={a.id}
                    type="button"
                    className={`extra ${marcado ? "is-marcado" : ""}`}
                    aria-pressed={marcado}
                    onClick={() => alternaAdicional(linha.uid, a.id)}
                  >
                    {a.nome} <span className="extra__preco">+{reais(a.preco)}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>
          <label className="extras__titulo ajustes__rotulo" htmlFor={`obs-${linha.uid}`}>
            Algum ajuste? <span className="campo__opcional">(opcional)</span>
          </label>
          <input
            id={`obs-${linha.uid}`}
            className="ticket__obs"
            type="text"
            value={linha.obs}
            onChange={(e) => anotar(linha.uid, e.target.value)}
            placeholder="Ex.: sem tomate"
            maxLength={120}
          />
        </div>
      ) : null}
    </li>
  );
}

// Porção e bebida: uma linha com quantidade.
function LinhaSimples({ linha, item }) {
  const { maisUm, menosUm, tirar } = useComanda();
  return (
    <li className="ticket__item">
      <div className="ticket__item-linha">
        <span className="ticket__nome">
          <span className="ticket__qtd">{linha.qtd}x</span> {item.nome}
        </span>
        <span className="ticket__valor">{reais(valorLinha(linha))}</span>
      </div>
      <div className="ticket__item-acoes">
        <div className="contador contador--claro" role="group" aria-label={`Quantidade de ${item.nome}`}>
          <button type="button" onClick={() => menosUm(linha.uid)} aria-label={`Tirar um ${item.nome}`}>
            −
          </button>
          <span>{linha.qtd}</span>
          <button type="button" onClick={() => maisUm(linha.uid)} aria-label={`Mais um ${item.nome}`}>
            +
          </button>
        </div>
        <button type="button" className="ticket__link" onClick={() => tirar(linha.uid)}>
          Tirar<span className="sr-only"> {item.nome}</span>
        </button>
      </div>
    </li>
  );
}

// Barra fixa que aparece quando há itens na comanda.
export function BarraComanda() {
  const { quantidade, linhas, abrir, aberta } = useComanda();
  if (quantidade === 0 || aberta) return null;
  return (
    <button type="button" className="barra-comanda" onClick={abrir}>
      <span className="barra-comanda__qtd">{quantidade}</span>
      <span>Ver comanda</span>
      <span className="barra-comanda__total">{reais(subtotal(linhas))}</span>
    </button>
  );
}

// A comanda: lista do pedido + dados de entrega/retirada + envio pelo WhatsApp.
export default function Comanda() {
  const { linhas, aberta, fechar, limpar } = useComanda();
  const [dados, setDados] = useState(vazio);
  const [erros, setErros] = useState({});
  const [enviado, setEnviado] = useState(false);
  const [tentou, setTentou] = useState(false);
  const painel = useRef(null);

  const muda = (campo) => (e) => setDados((d) => ({ ...d, [campo]: e?.target ? e.target.value : e }));

  useEffect(() => {
    if (!aberta) return;
    const onKey = (e) => e.key === "Escape" && fechar();
    document.addEventListener("keydown", onKey);
    document.body.classList.add("trava-rolagem");
    painel.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("trava-rolagem");
    };
  }, [aberta, fechar]);

  // Pedido enviado + painel fechado: a comanda volta vazia para o próximo pedido.
  useEffect(() => {
    if (aberta || !enviado) return;
    limpar();
    setDados(vazio);
    setErros({});
    setTentou(false);
    setEnviado(false);
  }, [aberta, enviado, limpar]);

  // Depois da primeira tentativa de envio, os avisos somem assim que o campo é preenchido.
  useEffect(() => {
    if (tentou) setErros(validaPedido(linhas, dados));
  }, [tentou, linhas, dados]);

  const total = subtotal(linhas);
  const entrega = dados.tipo === "entrega";

  const enviar = (e) => {
    e.preventDefault();
    setTentou(true);
    const encontrados = validaPedido(linhas, dados);
    setErros(encontrados);
    if (Object.keys(encontrados).length) {
      const primeiro = painel.current?.querySelector(".campo__erro");
      primeiro?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    window.open(linkWhatsApp(montaMensagem(linhas, dados)), "_blank", "noopener");
    setEnviado(true);
  };

  const novoPedido = () => {
    limpar();
    setDados(vazio);
    setErros({});
    setTentou(false);
    setEnviado(false);
    fechar();
  };

  return (
    <div className={`comanda ${aberta ? "is-aberta" : ""}`} aria-hidden={!aberta} inert={!aberta}>
      <div className="comanda__fundo" onClick={fechar} />

      <aside
        className="comanda__painel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-comanda"
        tabIndex={-1}
        ref={painel}
      >
        <div className="ticket">
          <header className="ticket__topo">
            <div>
              <p className="ticket__assinatura">Andri's</p>
              <h2 id="titulo-comanda" className="ticket__titulo">
                Sua comanda
              </h2>
            </div>
            <button type="button" className="ticket__fechar" onClick={fechar} aria-label="Fechar comanda">
              ×
            </button>
          </header>

          {enviado ? (
            <div className="ticket__enviado">
              <p className="ticket__enviado-titulo">Agora é só enviar no WhatsApp</p>
              <p>
                O WhatsApp abriu com o pedido escrito. Confira e toque em enviar por lá. A {site.dona} confirma
                o pedido e o tempo de preparo na conversa.
              </p>
              <p>Se o WhatsApp não abriu, toque no botão abaixo.</p>
              <a className="botao botao--preto" href={linkWhatsApp(montaMensagem(linhas, dados))} target="_blank" rel="noopener noreferrer">
                Abrir o WhatsApp de novo
              </a>
              <button type="button" className="ticket__link" onClick={novoPedido}>
                Começar um pedido novo
              </button>
            </div>
          ) : linhas.length === 0 ? (
            <div className="ticket__vazio">
              <p className="ticket__vazio-titulo">A comanda está vazia</p>
              <p>Escolha um lanche no cardápio e toque em Adicionar. Ele aparece aqui.</p>
              <a href="#cardapio" className="botao botao--preto" onClick={fechar}>
                Ver o cardápio
              </a>
            </div>
          ) : (
            <form className="ticket__form" onSubmit={enviar} noValidate>
              <ul className="ticket__itens">
                {linhas.map((l) => {
                  const item = itemPorId(l.id);
                  if (!item) return null;
                  const mesmos = linhas.filter((x) => x.id === l.id);
                  const ordem = mesmos.length > 1 ? `${mesmos.indexOf(l) + 1} de ${mesmos.length}` : null;
                  return aceitaAdicionais(item) ? (
                    <LinhaLanche key={l.uid} linha={l} item={item} ordem={ordem} />
                  ) : (
                    <LinhaSimples key={l.uid} linha={l} item={item} />
                  );
                })}
              </ul>
              <Erro texto={erros.itens} />

              <div className="ticket__corte" aria-hidden="true" />

              <fieldset className="campo">
                <legend>Como você quer receber?</legend>
                <div className="opcoes">
                  <Opcao nome="tipo" valor="retirada" atual={dados.tipo} onChange={muda("tipo")}>
                    Retirar no food truck
                  </Opcao>
                  <Opcao nome="tipo" valor="entrega" atual={dados.tipo} onChange={muda("tipo")}>
                    Receber em casa
                  </Opcao>
                </div>
                <Erro texto={erros.tipo} />
              </fieldset>

              <div className="campo">
                <label htmlFor="c-nome">Seu nome</label>
                <input id="c-nome" type="text" autoComplete="name" value={dados.nome} onChange={muda("nome")} />
                <Erro texto={erros.nome} />
              </div>

              {entrega ? (
                <>
                  <div className="campo">
                    <label htmlFor="c-rua">Rua e número</label>
                    <input id="c-rua" type="text" autoComplete="street-address" value={dados.rua} onChange={muda("rua")} />
                    <Erro texto={erros.rua} />
                  </div>
                  <div className="campo">
                    <label htmlFor="c-bairro">Bairro</label>
                    <input id="c-bairro" type="text" value={dados.bairro} onChange={muda("bairro")} />
                    <Erro texto={erros.bairro} />
                  </div>
                  <div className="campo">
                    <label htmlFor="c-comp">
                      Complemento ou ponto de referência <span className="campo__opcional">(opcional)</span>
                    </label>
                    <input id="c-comp" type="text" value={dados.complemento} onChange={muda("complemento")} />
                  </div>
                  <p className="ticket__aviso">
                    {site.taxaEntrega != null
                      ? `Taxa de entrega: ${reais(site.taxaEntrega)}.`
                      : "A taxa de entrega é combinada com a Andriele no WhatsApp."}
                  </p>
                </>
              ) : null}

              {dados.tipo === "retirada" ? (
                <fieldset className="campo">
                  <legend>Quando você vem buscar?</legend>
                  <div className="opcoes">
                    <Opcao nome="quando" valor="pronto" atual={dados.quando} onChange={muda("quando")}>
                      Assim que ficar pronto
                    </Opcao>
                    <Opcao nome="quando" valor="horario" atual={dados.quando} onChange={muda("quando")}>
                      Escolher horário
                    </Opcao>
                  </div>
                  {dados.quando === "horario" ? (
                    <input
                      className="campo__hora"
                      type="time"
                      value={dados.horario}
                      onChange={muda("horario")}
                      aria-label="Horário de retirada"
                    />
                  ) : null}
                  <Erro texto={erros.horario} />
                </fieldset>
              ) : null}

              <fieldset className="campo">
                <legend>Pagamento</legend>
                <div className="opcoes opcoes--tres">
                  <Opcao nome="pagamento" valor="pix" atual={dados.pagamento} onChange={muda("pagamento")}>
                    Pix
                  </Opcao>
                  <Opcao nome="pagamento" valor="cartao" atual={dados.pagamento} onChange={muda("pagamento")}>
                    Cartão
                  </Opcao>
                  <Opcao nome="pagamento" valor="dinheiro" atual={dados.pagamento} onChange={muda("pagamento")}>
                    Dinheiro
                  </Opcao>
                </div>
                {dados.pagamento === "dinheiro" ? (
                  <div className="campo campo--interno">
                    <label htmlFor="c-troco">
                      Troco para quanto? <span className="campo__opcional">(deixe vazio se não precisar)</span>
                    </label>
                    <input id="c-troco" type="text" inputMode="decimal" placeholder="Ex.: 100" value={dados.troco} onChange={muda("troco")} />
                  </div>
                ) : null}
                <Erro texto={erros.pagamento} />
              </fieldset>

              <div className="campo">
                <label htmlFor="c-obs">
                  Mais alguma coisa? <span className="campo__opcional">(opcional)</span>
                </label>
                <textarea id="c-obs" rows={2} value={dados.observacoes} onChange={muda("observacoes")} />
              </div>

              <div className="ticket__total">
                <span>{entrega && site.taxaEntrega == null ? "Subtotal" : "Total"}</span>
                <strong>{reais(total + (entrega && site.taxaEntrega != null ? site.taxaEntrega : 0))}</strong>
              </div>

              <button type="submit" className="botao botao--amarelo botao--cheio">
                Enviar pedido no WhatsApp
              </button>
              <p className="ticket__nota">
                O WhatsApp abre com o pedido já escrito. É só conferir e enviar.
              </p>
              <TracoPincel className="ticket__traco" />
            </form>
          )}
        </div>
      </aside>
    </div>
  );
}
