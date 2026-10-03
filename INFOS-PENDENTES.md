# Andri's Burger: o que falta preencher

Cada item diz onde mexer no projeto. 

## Contato e funcionamento

- [ ] **Horário de domingo.** Veio "21h30 às 23h3". No site está 21h30 às 23h30.
  Onde: `data/site.js` → `horarios`.
- [ ] **Taxa de entrega e bairros atendidos** (João vai ver com a Andriele). Hoje a mensagem diz "taxa de entrega a combinar". Se a taxa for fixa, coloque o valor em `taxaEntrega` e ela entra no total automaticamente. Se depender do bairro, avise que a gente monta uma lista.
  Onde: `data/site.js` → `taxaEntrega`.
- [ ] **Formas de pagamento.** O site oferece Pix, cartão e dinheiro com troco. Confirmar se aceita as três e se cartão é crédito, débito ou os dois.
  Onde: `lib/pedido.js` → `PAGAMENTOS` e `components/Comanda.jsx`.
- [ ] **O truck fica sempre no mesmo endereço?** O site trata a Rua Flamboyant, 932 como ponto fixo. Se o truck muda de lugar em alguns dias, a seção "Onde o truck fica" precisa mudar.
- [ ] **Faz pedido pelo iFood?** Se sim, dá para colocar um botão.
- [ ] **Mapa.** Já está incorporado pelo endereço. Abrir o site e conferir se o pino cai exatamente no truck. Se não cair, pegar o link de incorporação no Google Maps (Compartilhar > Incorporar um mapa) e colar o `src`.
  Onde: `data/site.js` → `mapaEmbed`.
- [ ] **Ordem das camadas do Andri's Burger.** A seção "Camada por camada" mostra o lanche aberto. A ordem das camadas é ilustrativa; confirmar com a Andriele como ela monta.
  Onde: `data/cardapio.js` → `camadas`.

## Cardápio

- [ ] **Cheddar Bacon.** No cardápio original, "bacon" aparecia duas vezes. A repetição foi tirada. Confirmar se faltava outro ingrediente no lugar.
- [ ] **X-Tudão.** Diz "hambúrguer", sem "bovino". Confirmar se é a mesma carne dos outros.
- [ ] **Batata frita simples.** Qual o peso? A média é 500 g.
- [ ] **Adicional queijo + bacon (R$ 15).** Vale para as duas porções de batata?
- [x] **Refrigerantes.** Coca-Cola, Guaraná e Sprite: lata R$ 6, 600 ml R$ 9, 2 litros R$ 17 (mesmo preço para os três sabores).
- [x] **Água.** Sem gás e com gás, R$ 4. Falta confirmar o tamanho.
- [x] **Pão.** Todos os lanches no pão brioche de 12 cm (destaque no topo do cardápio; "Pão" saiu da lista de ingredientes).
- [x] **Adicionais.** Maionese R$ 2, cebola roxa R$ 2, ovo R$ 3, calabresa R$ 6, bacon R$ 7, hambúrguer extra R$ 7. Valem para clássicos e especiais.
  Onde: `data/cardapio.js` → `adicionais`.
- [ ] **Água.** Tamanho e se tem com gás.
- [ ] **Textos novos do site.** "Tem nome e sobrenome", "Os dois que a casa assina embaixo", "E mais um. São dois." e os três passos do pedido foram escritos para o site. A Andriele pode trocar.
- [ ] **Frases de destaque dos especiais.** "O que leva o nome da casa" e "Cheddar cremoso escorrendo" foram escritas para o site. A Andriele pode trocar.
  Onde: `data/cardapio.js` → campo `destaque`.

## Fotos (todas em `public/fotos/`)

Formato: JPG, lado maior com 1600 px no máximo, até ~300 KB cada. Depois de colocar o arquivo, troque `temFoto: false` para `temFoto: true` no item.

**Lanches** (`public/fotos/lanches/`), de preferência todas com o mesmo fundo e o mesmo ângulo, porque aparecem lado a lado:

- [ ] x-burger.jpg
- [ ] x-salada.jpg
- [ ] x-egg.jpg
- [ ] x-frango.jpg
- [ ] x-calabresa.jpg
- [ ] x-bacon.jpg
- [ ] x-alcatra.jpg
- [ ] x-tudao.jpg
- [ ] andris-burger.jpg (destaque, formato mais largo)
- [ ] cheddar-bacon.jpg (destaque, formato mais largo)
- [ ] batata-queijo-bacon.jpg (foto da seção de porções, vertical)

**Food truck** (`public/fotos/food-truck/`):

- [x] andriele.jpg: a Andriele (colocada, autorizada por ela). A Andriele não vai ter fotos do truck, da janela nem da chapa; a seção usa só a foto dela.

## Textos já definidos (não mudar sem combinar)

- Slogan: Sabor que vicia, qualidade que fideliza!
- Chamada: Feito com ingredientes selecionados e muito amor!
- Fechamento: Experimente e apaixone-se!
- Chamada para pedido: Peça o seu!
