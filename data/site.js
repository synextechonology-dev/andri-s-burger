// Dados de contato, horários e textos da marca.
// Tudo que estiver com "CONFIRMAR" aparece em INFOS-PENDENTES.md.

export const site = {
  nome: "Andri's Burger",
  dona: "Andriele",
  cidade: "Camboriú, SC",

  // Número conferido pelo João. Todos os pedidos do site vão para cá.
  whatsapp: "554788438232",
  whatsappExibicao: "(47) 8843-8232",

  instagram: "https://www.instagram.com/andrisburger.oficial/",
  instagramUsuario: "@andrisburger.oficial",

  endereco: {
    rua: "Rua Flamboyant, 932",
    bairro: "Vila Monte Alegre",
    cidade: "Camboriú, SC",
    cep: "88348-837",
  },
  mapaUrl:
    "https://www.google.com/maps/search/?api=1&query=Rua+Flamboyant+932+Vila+Monte+Alegre+Camboriu+SC+88348-837",
  // Rota até o truck (abre o app do Google Maps no celular).
  rotaUrl:
    "https://www.google.com/maps/dir/?api=1&destination=Rua+Flamboyant+932+Vila+Monte+Alegre+Camboriu+SC+88348-837",
  // Mapa incorporado. Não precisa de chave de API.
  // CONFIRMAR: se o pino cair fora do lugar exato, troque pelo link de
  // incorporação do Google Maps (Compartilhar > Incorporar um mapa).
  mapaEmbed:
    "https://www.google.com/maps?q=Rua+Flamboyant+932+Vila+Monte+Alegre+Camboriu+SC+88348-837&z=16&output=embed",

  // CONFIRMAR: taxa de entrega e bairros atendidos.
  // Enquanto for null, a mensagem do pedido diz "taxa de entrega a combinar".
  taxaEntrega: null,

  textos: {
    slogan: "Sabor que vicia, qualidade que fideliza!",
    chamada: "Feito com ingredientes selecionados e muito amor!",
    fechamento: "Experimente e apaixone-se!",
    pedido: "Peça o seu!",
  },
};

// Horários no fuso de Brasília (Camboriú usa o mesmo).
// dia: 0 = domingo ... 6 = sábado. Horários em "HH:MM".
export const horarios = [
  { dia: 0, nome: "Domingo", abre: "21:30", fecha: "23:30" },
  { dia: 1, nome: "Segunda", abre: null, fecha: null },
  { dia: 2, nome: "Terça", abre: "19:30", fecha: "23:00" },
  { dia: 3, nome: "Quarta", abre: "19:30", fecha: "23:00" },
  { dia: 4, nome: "Quinta", abre: "19:30", fecha: "23:00" },
  { dia: 5, nome: "Sexta", abre: "19:30", fecha: "23:30" },
  { dia: 6, nome: "Sábado", abre: "19:30", fecha: "23:00" },
];
