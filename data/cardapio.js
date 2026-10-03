// Cardápio da Andri's Burger, extraído do cardápio oficial (Cardapio_Andris_Burger.docx).
// Preço em reais, número puro (17 = R$ 17,00).
// foto: caminho dentro de /public. Enquanto a foto não existir, deixe temFoto: false
// e o site mostra um espaço reservado com o nome do arquivo esperado.

export const categorias = [
  { id: "classicos", nome: "Clássicos" },
  { id: "especiais", nome: "Especiais da casa" },
  { id: "porcoes", nome: "Porções" },
  { id: "bebidas", nome: "Bebidas" },
];

export const itens = [
  // Clássicos
  {
    id: "x-burger",
    categoria: "classicos",
    nome: "X-Burger",
    ingredientes: ["hambúrguer bovino", "queijo muçarela", "presunto", "maionese da casa"],
    preco: 17,
    foto: "/fotos/lanches/x-burger.jpg",
    temFoto: false,
  },
  {
    id: "x-salada",
    categoria: "classicos",
    nome: "X-Salada",
    ingredientes: ["hambúrguer bovino", "queijo", "presunto", "alface", "tomate", "pepino", "maionese da casa"],
    preco: 20,
    foto: "/fotos/lanches/x-salada.jpg",
    temFoto: false,
  },
  {
    id: "x-egg",
    categoria: "classicos",
    nome: "X-Egg",
    ingredientes: ["hambúrguer bovino", "ovo", "queijo", "presunto", "tomate", "alface", "pepino", "milho", "maionese da casa"],
    preco: 23,
    foto: "/fotos/lanches/x-egg.jpg",
    temFoto: false,
  },
  {
    id: "x-frango",
    categoria: "classicos",
    nome: "X-Frango",
    ingredientes: ["frango", "queijo", "presunto", "alface", "tomate", "pepino", "milho", "maionese da casa"],
    preco: 25,
    foto: "/fotos/lanches/x-frango.jpg",
    temFoto: false,
  },
  {
    id: "x-calabresa",
    categoria: "classicos",
    nome: "X-Calabresa",
    ingredientes: ["hambúrguer bovino", "queijo", "presunto", "calabresa", "milho", "pepino", "alface", "tomate", "maionese da casa"],
    preco: 26,
    foto: "/fotos/lanches/x-calabresa.jpg",
    temFoto: false,
  },
  {
    id: "x-bacon",
    categoria: "classicos",
    nome: "X-Bacon",
    ingredientes: ["hambúrguer bovino", "queijo", "presunto", "bacon", "milho", "pepino", "tomate", "maionese da casa"],
    preco: 27,
    foto: "/fotos/lanches/x-bacon.jpg",
    temFoto: false,
  },
  {
    id: "x-alcatra",
    categoria: "classicos",
    nome: "X-Alcatra",
    ingredientes: ["carne de alcatra", "queijo", "presunto", "alface", "tomate", "pepino", "cebola roxa", "maionese da casa"],
    preco: 30,
    foto: "/fotos/lanches/x-alcatra.jpg",
    temFoto: false,
  },
  {
    id: "x-tudao",
    categoria: "classicos",
    nome: "X-Tudão",
    // CONFIRMAR: no cardápio está só "hambúrguer", sem "bovino".
    ingredientes: ["hambúrguer", "queijo", "presunto", "alface", "tomate", "milho", "pepino", "ovo", "bacon", "calabresa", "maionese especial"],
    preco: 40,
    foto: "/fotos/lanches/x-tudao.jpg",
    temFoto: false,
  },

  // Especiais da casa
  {
    id: "andris-burger",
    categoria: "especiais",
    nome: "Andri's Burger",
    destaque: "O que leva o nome da casa",
    ingredientes: ["2 hambúrgueres bovinos", "cheddar", "bacon", "alface", "cebola", "maionese especial"],
    // Camadas da ilustração "camada por camada" (de cima para baixo).
    // A ordem é ilustrativa. CONFIRMAR com a Andriele a montagem real.
    camadas: [
      { tipo: "pao-topo" },
      { tipo: "maionese", rotulo: "Maionese especial" },
      { tipo: "alface", rotulo: "Alface" },
      { tipo: "cebola", rotulo: "Cebola" },
      { tipo: "bacon", rotulo: "Bacon" },
      { tipo: "hamburguer", rotulo: "Hambúrguer bovino" },
      { tipo: "cheddar", rotulo: "Cheddar" },
      { tipo: "hamburguer", rotulo: "E mais um. São dois." },
      { tipo: "pao-base" },
    ],
    preco: 35,
    foto: "/fotos/lanches/andris-burger.jpg",
    temFoto: false,
  },
  {
    id: "cheddar-bacon",
    categoria: "especiais",
    nome: "Cheddar Bacon",
    destaque: "Cheddar cremoso escorrendo",
    // "bacon" aparecia duas vezes no cardápio original; a repetição foi removida.
    ingredientes: ["hambúrguer bovino", "cheddar cremoso", "bacon", "alface"],
    camadas: [{ tipo: "pao-topo" }, { tipo: "alface" }, { tipo: "bacon" }, { tipo: "cheddar" }, { tipo: "hamburguer" }, { tipo: "pao-base" }],
    preco: 25,
    foto: "/fotos/lanches/cheddar-bacon.jpg",
    temFoto: false,
  },

  // Porções
  {
    id: "batata-simples",
    categoria: "porcoes",
    nome: "Batata frita simples",
    // CONFIRMAR: peso da porção simples.
    preco: 12,
    foto: "/fotos/lanches/batata-simples.jpg",
    temFoto: false,
  },
  {
    id: "batata-media",
    categoria: "porcoes",
    nome: "Batata frita média",
    detalhe: "500 g",
    preco: 24,
    foto: "/fotos/lanches/batata-media.jpg",
    temFoto: false,
  },
  {
    id: "adicional-queijo-bacon",
    categoria: "porcoes",
    nome: "Adicional queijo + bacon",
    // CONFIRMAR: vale para as duas porções?
    detalhe: "Para a porção de batata",
    preco: 15,
    adicional: true,
  },

  // Bebidas
  // opcoes: sabores/tipos (rotuloOpcoes diz como chamar). Preço igual para todas as opções da linha.
  // No cardápio, a pessoa escolhe a opção antes de adicionar; na comanda, cada opção vira uma linha.
  // CONFIRMAR: tamanho da água.
  { id: "refri-lata", categoria: "bebidas", nome: "Refrigerante lata", preco: 6, rotuloOpcoes: "Sabor", opcoes: ["Coca-Cola", "Guaraná", "Sprite"] },
  { id: "refri-600", categoria: "bebidas", nome: "Refrigerante 600 ml", preco: 9, rotuloOpcoes: "Sabor", opcoes: ["Coca-Cola", "Guaraná", "Sprite"] },
  { id: "refri-2l", categoria: "bebidas", nome: "Refrigerante 2 litros", preco: 17, rotuloOpcoes: "Sabor", opcoes: ["Coca-Cola", "Guaraná", "Sprite"] },
  { id: "agua", categoria: "bebidas", nome: "Água", preco: 4, rotuloOpcoes: "Tipo", opcoes: ["Sem gás", "Com gás"] },
];

// Destaque do topo do cardápio. Vale para todos os lanches.
export const pao = "Todos os lanches no pão brioche de 12 cm.";

// Adicionais: valem para qualquer lanche (clássicos e especiais), não para porções e bebidas.
// Cada um pode ser marcado uma vez por linha da comanda.
export const adicionais = [
  { id: "maionese", nome: "Maionese", preco: 2 },
  { id: "cebola-roxa", nome: "Cebola roxa", preco: 2 },
  { id: "ovo", nome: "Ovo", preco: 3 },
  { id: "calabresa", nome: "Calabresa", preco: 6 },
  { id: "bacon", nome: "Bacon", preco: 7 },
  { id: "hamburguer-extra", nome: "Hambúrguer extra", preco: 7 },
];

const CATEGORIAS_COM_ADICIONAIS = ["classicos", "especiais"];

export function aceitaAdicionais(item) {
  return Boolean(item) && CATEGORIAS_COM_ADICIONAIS.includes(item.categoria);
}

export function adicionalPorId(id) {
  return adicionais.find((a) => a.id === id);
}

export function itensDa(categoria) {
  return itens.filter((i) => i.categoria === categoria);
}

export function itemPorId(id) {
  return itens.find((i) => i.id === id);
}
