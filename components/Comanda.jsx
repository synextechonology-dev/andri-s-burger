"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { aceitaAdicionais, adicionais, itemPorId } from "@/data/cardapio";
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
  const { linhas, aberta, fechar, adicionar, maisUm, menosUm, tirar, anotar, alternaAdicional, limpar } = useComanda();
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
                  const comAdicionais = aceitaAdicionais(item);
                  const nomeLinha = l.adicionais.length
                    ? `${item.nome} + ${l.adicionais.map((a) => adicionais.find((x) => x.id === a)?.nome).filter(Boolean).join(", ")}`
                    : item.nome;
                  return (
                    <li key={l.chave} className="ticket__item">
                      <div className="ticket__item-linha">
                        <span className="ticket__qtd">{l.qtd}x</span>
                        <span className="ticket__nome">{item.nome}</span>
                        <span className="ticket__valor">{reais(valorLinha(l))}</span>
                      </div>
                      <div className="ticket__item-acoes">
                        <div className="contador contador--claro" role="group" aria-label={`Quantidade de ${nomeLinha}`}>
                          <button type="button" onClick={() => menosUm(l.chave)} aria-label={`Tirar um ${nomeLinha}`}>
                            −
                          </button>
                          <span>{l.qtd}</span>
                          <button type="button" onClick={() => maisUm(l.chave)} aria-label={`Mais um ${nomeLinha}`}>
                            +
                          </button>
                        </div>
                        <button type="button" className="ticket__link" onClick={() => tirar(l.chave)}>
                          Tirar
                        </button>
                      </div>

                      {comAdicionais ? (
                        <fieldset className="extras">
                          <legend className="extras__titulo">
                            Adicionais
                            {l.qtd > 1 ? <span className="extras__nota"> (valem para os {l.qtd} desta linha)</span> : null}
                          </legend>
                          <div className="extras__lista">
                            {adicionais.map((a) => {
                              const marcado = l.adicionais.includes(a.id);
                              return (
                                <button
                                  key={a.id}
                                  type="button"
                                  className={`extra ${marcado ? "is-marcado" : ""}`}
                                  aria-pressed={marcado}
                                  onClick={() => alternaAdicional(l.chave, a.id)}
                                >
                                  {a.nome} <span className="extra__preco">+{reais(a.preco)}</span>
                                </button>
                              );
                            })}
                          </div>
                          {l.adicionais.length ? (
                            <button type="button" className="ticket__link extras__sem" onClick={() => adicionar(l.id)}>
                              Mais um sem adicionais<span className="sr-only"> ({item.nome})</span>
                            </button>
                          ) : null}
                        </fieldset>
                      ) : null}

                      {item.ingredientes ? (
                        <input
                          className="ticket__obs"
                          type="text"
                          value={l.obs}
                          onChange={(e) => anotar(l.chave, e.target.value)}
                          placeholder="Algum ajuste? Ex.: sem tomate"
                          aria-label={`Observação para ${nomeLinha}`}
                          maxLength={120}
                        />
                      ) : null}
                    </li>
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
