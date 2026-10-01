# Contexto para o Claude Code: site da Andri's Burger

Site de uma hamburgueria que funciona num **food truck** em Camboriú, SC. A dona é a **Andriele**. Projeto da Synex.

O site tem dois trabalhos: mostrar o cardápio com cara de hamburgueria e **receber pedidos**. O pedido não passa por servidor nenhum: a pessoa monta a comanda, preenche retirada ou entrega e o site abre o WhatsApp da Andriele com a mensagem pronta (`wa.me`). Não há banco de dados, login ou formulário de contato.

## Stack

- Next.js (App Router), React, **JavaScript** (sem TypeScript).
- **CSS puro** num arquivo só: `app/globals.css`. Sem Tailwind, sem CSS-in-JS, sem biblioteca de componentes.
- Fontes via `next/font/google` em `app/layout.jsx`.

## Mapa do projeto

```
app/
  layout.jsx        fontes, metadados, <html lang="pt-BR">
  page.jsx          ordem das seções
  globals.css       tokens + todos os estilos (comentado por seção)
  icon.png          favicon (selo)
components/
  ComandaContext    estado do carrinho (salvo no localStorage)
  Cabecalho         topo fixo + botão da comanda + menu mobile
  Abertura          primeira dobra: janela do food truck com toldo, neon e porta de enrolar
  Letreiro          faixas de texto que deslizam com a rolagem
  Anatomia          "Camada por camada": o Andri's Burger se abre conforme a rolagem
  ComoPedir         os três passos do pedido
  Ilustracoes       camadas do lanche, batata e truck em SVG (cores do manual)
  useRolagem        liga a rolagem a uma variável CSS --p (0 a 1)
  StatusChapa       "Chapa ligada / desligada" calculado pelo horário
  Cardapio          clássicos, especiais, porções e bebidas
  BotaoAdicionar    Adicionar / − 1 +
  Comanda           painel do pedido + BarraComanda (barra fixa)
  FoodTruck         sobre o truck + galeria de fotos
  OndeQuando        endereço, mapa, tabela de horários
  Rodape
  Marca             Faiscas, TracoPincel, Preco, Foto (elementos do manual)
data/
  site.js           WhatsApp, endereço, horários, textos da marca
  cardapio.js       itens, preços, ingredientes, caminho das fotos
lib/
  horario.js        aberto/fechado no fuso America/Sao_Paulo
  pedido.js         validação e montagem da mensagem do WhatsApp
public/
  marca/            selo.png (original) e selo-recortado.png (círculo com transparência)
  fotos/            fotos reais entram aqui
```

## Identidade visual (não inventar fora disso)

Fonte: PDF "Identidade visual Andri's Burger".

| Token | Hex | Uso |
|---|---|---|
| `--amarelo` | #F6B90E | logo, preços, destaques |
| `--preto` | #0D0D0D | fundo principal |
| `--guardanapo` | #F5F1E8 | assinatura e texto sobre preto |
| `--queijo` | #FFD54A | brilho, padrão gergelim |
| `--marrom` | #5A3220 | apoio pontual, **nunca fundo** |
| `--carvao` | #1C1A17 | superfícies sobre o preto |

Proporção do manual: preto 55%, amarelo 25%, guardanapo 12%, marrom 8%.

- **Kaushan Script**: assinatura. Uma palavra ou frase curta por bloco, sempre em guardanapo ou preto (nunca amarelo).
- **Bebas Neue**: títulos, nomes de lanche, preços.
- **Barlow** 400/600/700: descrições e textos.
- Elementos: faíscas (três traços em leque), traço de pincel sob a assinatura, selo de oferta (anel), padrão gergelim.
- Cardápio no padrão do manual: nome em Bebas, descrição em Barlow, preço em amarelo com "R$" pequeno em cima do número.

### Fundos alternados (pedido do cliente)

Cada seção usa uma classe de tema que define as variáveis de cor: `tema-preto`, `tema-carvao`, `tema-guardanapo`, `tema-amarelo` (+ `gergelim` para o padrão). Ordem atual: preto (abertura) → amarelo (letreiro) → carvão (camada por camada) → guardanapo (pedir é assim) → preto (clássicos) → carvão (especiais) → guardanapo (porções) → amarelo (bebidas) → preto (food truck) → guardanapo (onde e quando) → amarelo (rodapé). Não deixe duas seções seguidas com o mesmo fundo.

## Tom de voz

Do manual: "como no balcão: próximo, animado e curto. Pode ter gíria, mas não precisa gritar." Frases curtas, verbos diretos, sem travessão (—), sem exagero ("incrível", "o melhor da cidade"). Não inventar fatos sobre a casa (tempo de entrega, ingredientes, prêmios).

## Regras

1. Conteúdo vem de `data/`. Não escreva preço ou ingrediente direto num componente.
2. Tudo que ainda não foi confirmado está em `INFOS-PENDENTES.md` e comentado com `CONFIRMAR` no código. Quando uma informação chegar, atualize os dois.
3. Responsivo de 320 px a 1920 px sem rolagem horizontal. Testar em 360, 390, 768, 1024 e 1440.
4. A porta de enrolar da abertura só anima na primeira visita e não aparece com `prefers-reduced-motion`. É o único movimento automático do site; não acrescente animações de entrada em seções. O letreiro e o "camada por camada" só se mexem quando a pessoa rola (via `useRolagem`); com movimento reduzido ficam parados e o lanche aparece aberto. O neon da abertura brilha fixo, sem piscar.
5. Acessibilidade: foco visível, botões com rótulo, contraste AA. Amarelo sobre guardanapo não passa contraste: em fundo claro, preço e botão são pretos.
6. Fotos: quando chegarem, trocar `temFoto` para `true`. Se quiser otimizar, trocar o `<img>` do componente `Foto` por `next/image`.

## Próximos passos sugeridos

- [ ] `npm install` e `npm run dev`, conferir no celular.
- [ ] Preencher `INFOS-PENDENTES.md` (WhatsApp primeiro).
- [ ] Colocar fotos reais.
- [x] Incorporar o mapa (iframe do Google Maps, `site.mapaEmbed`). Conferir se o pino cai no lugar certo.
- [ ] Testar a mensagem do pedido mandando para o próprio WhatsApp antes de publicar.
- [ ] Publicar na Vercel e apontar o domínio.
