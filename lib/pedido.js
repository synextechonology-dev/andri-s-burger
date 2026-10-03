import { site } from "@/data/site";
import { adicionalPorId, itemPorId } from "@/data/cardapio";

export const reais = (valor) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// Nome do item com a opção escolhida: "Refrigerante lata (Guaraná)".
export function nomeComOpcao(linha) {
  const item = itemPorId(linha.id);
  if (!item) return "";
  return linha.opcao ? `${item.nome} (${linha.opcao})` : item.nome;
}

// Adicionais da linha, na ordem em que a pessoa marcou.
export function adicionaisDa(linha) {
  return (linha.adicionais ?? []).map(adicionalPorId).filter(Boolean);
}

// Valor da linha = (preço do lanche + adicionais) × quantidade.
export function valorLinha(linha) {
  const item = itemPorId(linha.id);
  if (!item) return 0;
  const extras = adicionaisDa(linha).reduce((s, a) => s + a.preco, 0);
  return (item.preco + extras) * linha.qtd;
}

export function subtotal(linhas) {
  return linhas.reduce((soma, l) => soma + valorLinha(l), 0);
}

// Para a mensagem: junta lanches idênticos (mesmo lanche, mesmos adicionais e
// mesma observação) numa linha só com "Nx", na ordem em que apareceram.
export function agrupaLinhas(linhas) {
  const grupos = new Map();
  for (const l of linhas) {
    const obs = (l.obs ?? "").trim();
    const chave = `${l.id}|${l.opcao ?? ""}|${[...(l.adicionais ?? [])].sort().join(",")}|${obs.toLowerCase()}`;
    const g = grupos.get(chave);
    if (g) g.qtd += l.qtd;
    else grupos.set(chave, { ...l, obs });
  }
  return [...grupos.values()];
}

const PAGAMENTOS = {
  pix: "Pix",
  cartao: "Cartão",
  dinheiro: "Dinheiro",
};

// Confere o formulário da comanda. Devolve { campo: "mensagem" } com o que falta.
export function validaPedido(linhas, dados) {
  const erros = {};
  if (linhas.length === 0) erros.itens = "Sua comanda está vazia. Escolha pelo menos um item no cardápio.";
  if (!dados.nome.trim()) erros.nome = "Escreva seu nome para a Andriele saber de quem é o pedido.";
  if (!dados.tipo) erros.tipo = "Escolha se vai retirar no food truck ou receber em casa.";
  if (dados.tipo === "entrega") {
    if (!dados.rua.trim()) erros.rua = "Escreva a rua e o número para a entrega.";
    if (!dados.bairro.trim()) erros.bairro = "Escreva o bairro para a entrega.";
  }
  if (dados.tipo === "retirada" && dados.quando === "horario" && !dados.horario) {
    erros.horario = "Escolha o horário em que você vai buscar.";
  }
  if (!dados.pagamento) erros.pagamento = "Escolha a forma de pagamento.";
  return erros;
}

// Monta o texto que chega no WhatsApp da Andriele.
// Asteriscos viram negrito no WhatsApp.
export function montaMensagem(linhas, dados) {
  const total = subtotal(linhas);
  const entrega = dados.tipo === "entrega";
  const l = [];

  l.push(`*Novo pedido pelo site*`);
  l.push(`Oi, ${site.dona}! Quero fazer um pedido.`);
  l.push("");
  l.push(`*Nome:* ${dados.nome.trim()}`);
  l.push(`*Como vou receber:* ${entrega ? "Entrega" : "Retirada no food truck"}`);

  if (entrega) {
    l.push(`*Endereço:* ${dados.rua.trim()}, ${dados.bairro.trim()}`);
    if (dados.complemento.trim()) l.push(`*Complemento / referência:* ${dados.complemento.trim()}`);
  } else {
    l.push(`*Retirada:* ${dados.quando === "horario" ? `às ${dados.horario}` : "assim que ficar pronto"}`);
  }

  l.push("");
  l.push(`*Pedido*`);
  for (const linha of agrupaLinhas(linhas)) {
    const item = itemPorId(linha.id);
    if (!item) continue;
    const extras = adicionaisDa(linha).map((a) => a.nome);
    const base = nomeComOpcao(linha);
    const nome = extras.length ? `${base} + ${extras.join(", ")}` : base;
    l.push(`${linha.qtd}x ${nome} | ${reais(valorLinha(linha))}`);
    if (linha.obs?.trim()) l.push(`   obs.: ${linha.obs.trim()}`);
  }

  l.push("");
  l.push(`*Subtotal:* ${reais(total)}`);
  if (entrega) {
    if (site.taxaEntrega != null) {
      l.push(`*Taxa de entrega:* ${reais(site.taxaEntrega)}`);
      l.push(`*Total:* ${reais(total + site.taxaEntrega)}`);
    } else {
      l.push(`*Taxa de entrega:* a combinar`);
    }
  } else {
    l.push(`*Total:* ${reais(total)}`);
  }

  l.push("");
  let pagamento = PAGAMENTOS[dados.pagamento];
  if (dados.pagamento === "dinheiro") {
    pagamento += dados.troco.trim() ? ` (troco para R$ ${dados.troco.trim()})` : " (não preciso de troco)";
  }
  l.push(`*Pagamento:* ${pagamento}`);

  if (dados.observacoes.trim()) {
    l.push(`*Observações:* ${dados.observacoes.trim()}`);
  }

  return l.join("\n");
}

export function linkWhatsApp(texto) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(texto)}`;
}
