# Andri's Burger · site

Site do food truck Andri's Burger (Camboriú, SC), com cardápio e pedido direto pelo WhatsApp.

## Rodar

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

## Onde mexer

- Preços, lanches e ingredientes: `data/cardapio.js`
- WhatsApp, endereço, horários e textos: `data/site.js`
- Mensagem que chega no WhatsApp: `lib/pedido.js`
- Cores e estilos: `app/globals.css`
- O que ainda falta: `INFOS-PENDENTES.md`
- Contexto completo para o Claude Code: `CLAUDE.md`

## Como o pedido funciona

1. A pessoa toca em **Adicionar** nos itens do cardápio.
2. Abre a **comanda**, ajusta quantidades e escreve observações por lanche ("sem tomate").
3. Escolhe **retirar no food truck** (na hora ou com horário marcado) ou **receber em casa** (rua, bairro, referência).
4. Escolhe Pix, cartão ou dinheiro (com troco).
5. O site abre o WhatsApp da Andriele com a mensagem pronta. A pessoa só confere e envia.

Exemplo de mensagem:

```
*Novo pedido pelo site*
Oi, Andriele! Quero fazer um pedido.

*Nome:* Mariana
*Como vou receber:* Entrega
*Endereço:* Rua das Palmeiras, 120, Centro
*Complemento / referência:* Casa azul

*Pedido*
2x X-Bacon | R$ 54,00
   obs.: sem tomate
1x Batata frita média | R$ 24,00
1x Refrigerante lata | R$ 6,00

*Subtotal:* R$ 84,00
*Taxa de entrega:* a combinar

*Pagamento:* Dinheiro (troco para R$ 100)
```
