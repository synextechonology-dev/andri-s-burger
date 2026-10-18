# Inventário de dados: site Andri's Burger

Levantamento feito só por leitura do código, sem alterar nenhum arquivo do site.

- Repositório: `synextechonology-dev/andri-s-burger`, commit `6a3f0c5` (11/10/2026).
- Objetivo: conferir se o banco do SaaS (Supabase) cobre tudo o que o site usa e importar a Andri's como primeira loja.
- Arquivo de importação gerado junto: `cardapio-seed.json`. Ele foi gerado a partir de `data/site.js` e `data/cardapio.js`, sem dado digitado à mão.

---

## 1. Onde os dados estão

**O cardápio está centralizado.** Preços, ingredientes, fotos, adicionais e opções vêm de `data/cardapio.js`. Os dados da loja vêm de `data/site.js`. Nenhum componente tem preço escrito direto no código: os componentes só leem esses dois arquivos.

| Arquivo | O que tem | Linhas |
|---|---|---|
| `data/site.js` | Nome, dona, cidade, WhatsApp, Instagram, endereço, links de mapa, taxa de entrega, textos da marca | `site` em 4–43 |
| `data/site.js` | Horários por dia da semana | `horarios` em 47–55 |
| `data/cardapio.js` | Categorias | `categorias` em 6–11 |
| `data/cardapio.js` | Produtos (17 itens) | `itens` em 13–163 |
| `data/cardapio.js` | Destaque do pão ("pão brioche de 12 cm") | `pao` em 166 |
| `data/cardapio.js` | Adicionais de lanche (6) | `adicionais` em 170–177 |
| `data/cardapio.js` | Regra "adicionais só em clássicos e especiais" | `CATEGORIAS_COM_ADICIONAIS` em 179 |
| `lib/pedido.js` | Formas de pagamento (rótulos) | `PAGAMENTOS` em 45–49 |
| `lib/pedido.js` | Validação, cálculo e mensagem do WhatsApp | 20–125 |
| `lib/horario.js` | Aberto/fechado, fuso `America/Sao_Paulo` | todo o arquivo |
| `components/ComandaContext.jsx` | Carrinho, expiração da comanda (1 h), chave do localStorage | 16–20 |
| `components/Comanda.jsx` | Campos do formulário de pedido | estado `vazio` em 10–21, campos em 296–410 |
| `app/layout.jsx` | Título, descrição e Open Graph (texto fixo) | 10–21 |

**Texto da loja escrito direto nos componentes** (fora de `data/`). Isso não é preço, mas vira problema quando o site passar a ler do banco:

| Onde | Texto fixo |
|---|---|
| `app/layout.jsx` 11–16 | "Food truck em Camboriú", slogan e descrições do SEO |
| `components/Anatomia.jsx` 19, 37 | Usa o id fixo `"andris-burger"` e a frase "o lanche que leva o nome da casa" |
| `components/FoodTruck.jsx` 26–35 | Texto "sobre a casa" e "Dona da Andri's" |
| `components/OndeQuando.jsx` 49 | "A Andri's tá aqui" |
| `components/Cabecalho.jsx` 29, `Rodape.jsx` 39 e 44 | "Andri's" e "Andri's Burger" escritos à mão |
| `components/Cardapio.jsx` 21, 167, 182, 205 | Frases de apoio das seções ("Os dois que a casa assina embaixo." etc.) |
| `components/ComoPedir.jsx` 7–16 | Os três passos do pedido |
| `components/Comanda.jsx` 340 | "A taxa de entrega é combinada com a Andriele no WhatsApp." |

---

## 2. Dados da loja

| Campo | Valor no site | Fonte |
|---|---|---|
| Nome | Andri's Burger | `site.nome` |
| Dona | Andriele | `site.dona` |
| WhatsApp (pedidos) | 554788438232, exibido como (47) 8843-8232 | `site.whatsapp`, `site.whatsappExibicao` |
| Endereço / ponto do truck | Rua Flamboyant, 932, Vila Monte Alegre, CEP 88348-837 | `site.endereco` |
| Cidade | Camboriú, SC | `site.cidade` e `site.endereco.cidade` (duplicado) |
| Mapa | Link de busca, link de rota e iframe do Google Maps | `site.mapaUrl`, `rotaUrl`, `mapaEmbed` |
| Instagram | https://www.instagram.com/andrisburger.oficial/ (@andrisburger.oficial) | `site.instagram` |
| Outras redes | Nenhuma | |
| Formas de pagamento | Pix, Cartão, Dinheiro (com troco) | `lib/pedido.js` 45 |
| Entrega | Sim | opção "Receber em casa" na comanda |
| Retirada | Sim (na hora ou com horário marcado) | opção "Retirar no food truck" |
| Pedido mínimo | Não existe | |
| Taxa de entrega | `null`: a mensagem diz "a combinar" | `site.taxaEntrega` |
| Bairros atendidos | Não existe | |

**Horário de funcionamento** (`data/site.js` 47–55):

| Dia | Abre | Fecha |
|---|---|---|
| Domingo | 21:30 | 23:30 |
| Segunda | fechado | fechado |
| Terça | 19:30 | 23:00 |
| Quarta | 19:30 | 23:00 |
| Quinta | 19:30 | 23:00 |
| Sexta | 19:30 | 23:30 |
| Sábado | 19:30 | 23:00 |

Só existe um turno por dia, e o horário não passa da meia-noite. Não há cadastro de feriados nem de dias fechados fora da semana.

**Textos da marca** (`site.textos`): slogan "Sabor que vicia, qualidade que fideliza!", chamada "Feito com ingredientes selecionados e muito amor!", fechamento "Experimente e apaixone-se!", pedido "Peça o seu!".

---

## 3. Cardápio

4 categorias, 17 produtos, 6 adicionais pagos, 2 grupos de opção sem custo (sabor do refrigerante e tipo de água). Não há tamanhos, combos, promoções ou item esgotado.

### Clássicos

| Produto | Ingredientes (como o site mostra) | Preço | Foto |
|---|---|---|---|
| X-Burger | hambúrguer bovino, queijo muçarela, presunto e maionese da casa | 17 | sem foto |
| X-Salada | hambúrguer bovino, queijo, presunto, alface, tomate, pepino e maionese da casa | 20 | `/fotos/lanches/x-salada.jpg` |
| X-Egg | hambúrguer bovino, ovo, queijo, presunto, tomate, alface, pepino, milho e maionese da casa | 23 | sem foto |
| X-Frango | frango, queijo, presunto, alface, tomate, pepino, milho e maionese da casa | 25 | sem foto |
| X-Calabresa | hambúrguer bovino, queijo, presunto, calabresa, milho, pepino, alface, tomate e maionese da casa | 26 | `/fotos/lanches/x-calabresa.jpg` |
| X-Bacon | hambúrguer bovino, queijo, presunto, bacon, milho, pepino, tomate e maionese da casa | 27 | `/fotos/lanches/x-bacon.jpg` |
| X-Alcatra | carne de alcatra, queijo, presunto, alface, tomate, pepino, cebola roxa e maionese da casa | 30 | `/fotos/lanches/x-alcatra.jpg` |
| X-Tudão | hambúrguer, queijo, presunto, alface, tomate, milho, pepino, ovo, bacon, calabresa e maionese especial | 40 | `/fotos/lanches/x-tudao.jpg` |

### Especiais da casa

| Produto | Ingredientes | Preço | Foto | Campos extras |
|---|---|---|---|---|
| Andri's Burger | 2 hambúrgueres bovinos, cheddar, bacon, alface, cebola e maionese especial | 35 | `/fotos/lanches/andris-burger.jpg` | `destaque`, `camadas` (9 camadas da ilustração) |
| Cheddar Bacon | hambúrguer bovino, cheddar cremoso, bacon e alface | 25 | sem foto | `destaque`, `camadas` (6) |

### Porções

| Produto | Detalhe | Preço |
|---|---|---|
| Batata frita simples | nenhum (peso não informado) | 12 |
| Batata frita média | 500 g | 24 |
| Adicional queijo + bacon | "Para a porção de batata" | 15 |

### Bebidas (cada linha tem um grupo de opção obrigatório, sem custo extra)

| Produto | Preço | Grupo | Opções |
|---|---|---|---|
| Refrigerante lata | 6 | Sabor (escolha 1) | Coca-Cola, Guaraná, Sprite |
| Refrigerante 600 ml | 9 | Sabor (escolha 1) | Coca-Cola, Guaraná, Sprite |
| Refrigerante 2 litros | 17 | Sabor (escolha 1) | Coca-Cola, Guaraná, Sprite |
| Água | 4 | Tipo (escolha 1) | Sem gás, Com gás |

A primeira opção já vem marcada (`opcaoDo` em `ComandaContext.jsx` 29–33).

### Adicionais de lanche (`data/cardapio.js` 170–177)

Valem para todos os clássicos e especiais (10 produtos). Não valem para porções e bebidas.

| Adicional | Preço extra |
|---|---|
| Maionese | 2 |
| Cebola roxa | 2 |
| Ovo | 3 |
| Calabresa | 6 |
| Bacon | 7 |
| Hambúrguer extra | 7 |

Regra: cada adicional liga ou desliga uma vez por lanche, ou seja, não dá para pedir "2x bacon". Não há mínimo, e o máximo na prática é 6 (todos marcados). Os adicionais ficam no código como lista global, não por produto.

### O que não é preço simples

| Recurso | Como funciona | Onde |
|---|---|---|
| Observação livre por lanche | "Algum ajuste?" (ex.: sem tomate), máx. 120 caracteres | `Comanda.jsx` 108–118 |
| Observação geral do pedido | "Mais alguma coisa?", sem limite | `Comanda.jsx` 394–397 |
| Um lanche por linha | Cada lanche é uma linha própria (`qtd` 1) com seus adicionais; "Mais um igual" duplica | `ComandaContext.jsx` 11–14, 142 |
| Agrupamento na mensagem | Lanches idênticos (mesmos adicionais e observação) viram "Nx" | `lib/pedido.js` 33–43 |
| Destaque global do pão | "Todos os lanches no pão brioche de 12 cm." | `data/cardapio.js` 166 |
| Camadas ilustradas | Ordem das camadas do Andri's Burger para a animação | `data/cardapio.js`, campo `camadas` |

Não existe ponto da carne, meio a meio, tamanho, combo, promoção nem horário por produto.

---

## 4. Dados coletados do cliente

Todos ficam na comanda (`components/Comanda.jsx`) e vão **somente** para a mensagem do WhatsApp (link `wa.me`). Nada é enviado a servidor ou salvo em banco. O formulário não fica salvo no navegador, só os itens.

| Campo | Tipo | Obrigatório | Regra |
|---|---|---|---|
| Itens da comanda | lista | Sim | pelo menos 1 |
| Como vai receber | Retirada / Entrega | Sim | |
| Nome | texto | Sim | |
| Rua e número | texto | Só na entrega | um campo único para rua + número |
| Bairro | texto livre | Só na entrega | não há lista de bairros |
| Complemento / referência | texto | Não | |
| Quando vem buscar | "Assim que ficar pronto" / horário | Só na retirada | padrão: assim que ficar pronto |
| Horário de retirada | `type="time"` | Só se escolher horário | não confere com o horário de funcionamento |
| Pagamento | Pix / Cartão / Dinheiro | Sim | |
| Troco para | texto | Não | só aparece no dinheiro; não valida número nem se é maior que o total |
| Observação por lanche | texto | Não | máx. 120 caracteres |
| Observações gerais | texto | Não | |

**Não é coletado:** telefone (vem do próprio WhatsApp de quem envia), CPF, e-mail, CEP, número separado da rua, aceite de termos ou de promoções.

Validação: `validaPedido` em `lib/pedido.js` 52–66.

---

## 5. Mensagem do WhatsApp

Gerada por `montaMensagem(linhas, dados)` em `lib/pedido.js` 70–125 e enviada por `linkWhatsApp(texto)` (linha 127), que monta `https://wa.me/554788438232?text=<texto codificado>`. O envio acontece em `Comanda.jsx` 220 com `window.open`.

Formato exato (asterisco = negrito no WhatsApp; os trechos entre `<>` variam):

```
*Novo pedido pelo site*
Oi, Andriele! Quero fazer um pedido.

*Nome:* <nome>
*Como vou receber:* <Entrega | Retirada no food truck>
*Endereço:* <rua e número>, <bairro>                    (só na entrega)
*Complemento / referência:* <complemento>               (só na entrega, se preenchido)
*Retirada:* <às HH:MM | assim que ficar pronto>          (só na retirada)

*Pedido*
<qtd>x <Produto> (<opção>) + <Adicional 1>, <Adicional 2> | R$ <valor da linha>
   obs.: <observação do lanche>                          (se houver)

*Subtotal:* R$ <subtotal>
*Taxa de entrega:* a combinar                            (entrega, enquanto taxaEntrega = null)
*Taxa de entrega:* R$ <taxa> / *Total:* R$ <total>       (entrega, se taxaEntrega tiver valor)
*Total:* R$ <subtotal>                                   (retirada)

*Pagamento:* <Pix | Cartão | Dinheiro (troco para R$ <valor>) | Dinheiro (não preciso de troco)>
*Observações:* <observações gerais>                      (se houver)
```

Exemplo de linha de item: `2x X-Bacon + Bacon, Ovo | R$ 74,00`.

---

## 6. Cálculos

| Ponto | Como é hoje | Onde |
|---|---|---|
| Valor da linha | (preço do item + soma dos adicionais) × quantidade | `valorLinha`, `lib/pedido.js` 20–25 |
| Subtotal | soma das linhas | `subtotal`, `lib/pedido.js` 27–29 |
| Taxa de entrega | só entra se `site.taxaEntrega` não for `null`. Hoje é `null`, então o total da entrega não fecha no site | `lib/pedido.js` 103–108, `Comanda.jsx` 401–402 |
| Desconto / cupom | não existe | |
| Opção de bebida | não muda o preço | |
| Arredondamento | nenhum. Os preços são inteiros em reais; a formatação usa `toLocaleString("pt-BR", BRL)` | `reais`, `lib/pedido.js` 4 |

O cálculo é feito só no navegador. Um banco precisa recalcular no servidor e não confiar no total enviado pelo cliente.

---

## 7. Privacidade e cookies

| Item | Situação |
|---|---|
| Cookies próprios | Nenhum |
| `localStorage` `andris-comanda-v2` | Itens da comanda (id, opção, qtd, adicionais, observação) + `alteradoEm`. Expira em 1 h sem alteração. Não guarda nome, endereço nem pagamento |
| `localStorage` `andris-ja-veio` | Marca "1" para não repetir a animação da porta na próxima visita |
| `localStorage` `andris-comanda-v1` | Formato antigo; o site só apaga |
| `sessionStorage` | Não usa |
| Google Analytics, Tag Manager, Meta Pixel | Não tem |
| Vercel Analytics ou outro script de medição | Não tem (`package.json` só tem next, react e react-dom) |
| Fontes | `next/font/google`: baixadas no build e servidas pelo próprio site, sem chamada ao Google na visita |
| Iframe do Google Maps | **Sim**, em `OndeQuando.jsx` 52–60 (`loading="lazy"`). Quando carrega, o Google recebe o IP do visitante e pode gravar cookies dele |
| Envio de dados para fora | Só pelo link `wa.me`: os dados do pedido vão no texto para o WhatsApp (Meta) quando a pessoa toca em enviar |
| Política de privacidade | Não existe |
| Política de cookies / banner de consentimento | Não existe |

---

## 8. Lacunas para um sistema de pedidos

Ordenadas pelo impacto na ligação com o SaaS.

1. **Taxa de entrega e bairros atendidos.** `taxaEntrega` está `null`, não há lista de bairros e o bairro é texto livre. O total da entrega nunca fecha no site.
2. **Pedido não é registrado.** Ele só existe na conversa do WhatsApp: não tem número, histórico nem status (recebido, em preparo, saiu, entregue). Também não existe "pedido confirmado pela loja" no sistema.
3. **Cliente não é identificado.** Não há telefone digitado nem cadastro, então não dá para reconhecer cliente recorrente nem preencher endereço salvo.
4. **Formas de pagamento não confirmadas.** O site oferece Pix, cartão e dinheiro, mas o `INFOS-PENDENTES.md` ainda marca como "confirmar". Também não se sabe se o cartão é crédito, débito ou os dois. O Pix não tem chave nem pagamento online.
5. **Sem disponibilidade por item.** Não há "esgotado" ou "pausado", e todo item aparece sempre. No seed, `disponivel` está `true` em tudo porque o site não tem esse campo.
6. **Pedido mínimo:** não existe.
7. **Horário de retirada não é validado** contra o horário de funcionamento. Dá para marcar 15h numa segunda-feira.
8. **Pedido fora do horário é aceito.** O site mostra "Chapa desligada", mas deixa enviar.
9. **Feriados e dias fechados extras:** não existem. Só há a grade semanal fixa.
10. **Endereço sem estrutura:** rua e número no mesmo campo, sem CEP, sem cidade e sem geolocalização.
11. **Troco sem validação:** texto livre.
12. **Aceite de privacidade e de promoções:** não existe, nem política publicada.
13. **Combos e promoções:** não existem no site. O seed sai com `combos: []`.
14. **Tamanhos:** não existem. Bebidas de tamanhos diferentes são produtos separados.
15. **Fotos faltando:** 11 dos 17 produtos estão sem foto (X-Burger, X-Egg, X-Frango, Cheddar Bacon, as 3 porções e as 4 bebidas). No seed, `foto` é `null` nesses produtos.
16. **Campos do site sem lugar no formato do seed:** `destaque` (frase dos especiais), `camadas` (ilustração), `pao` (aviso global), `detalhe` (ex.: "500 g"), `site.dona`, `instagram`, `textos` da marca, `mapaEmbed`. Se o painel for multinicho, eles precisam de campos genéricos, como "destaque", "aviso do cardápio", "dados de mídia" e "textos da loja".

---

## 9. Inconsistências

| # | Problema | Onde |
|---|---|---|
| 1 | **"Adicional queijo + bacon" foi cadastrado como produto**, mas é um adicional de batata. Pode ser pedido sozinho, sem batata nenhuma | `data/cardapio.js`, categoria `porcoes` |
| 2 | **"Bacon" aparece com dois preços:** adicional de lanche R$ 7 e dentro do "queijo + bacon" da batata R$ 15. Não é erro, mas o banco precisa de grupos de adicional por produto/categoria, não de uma lista única | `adicionais` e item `adicional-queijo-bacon` |
| 3 | **Fotos declaradas que não existem:** `x-burger.jpg`, `x-egg.jpg`, `x-frango.jpg`, `cheddar-bacon.jpg`, `batata-simples.jpg`, `batata-media.jpg` estão no código com `temFoto: false` e o arquivo não está em `public/` | `data/cardapio.js` |
| 4 | **Cidade em dois lugares** (`site.cidade` e `site.endereco.cidade`), e vários componentes recortam ", SC" com `.replace(", SC", "")`. Isso quebra em loja de outro estado | `Abertura.jsx` 86, `FoodTruck.jsx` 26 |
| 5 | **Seção "Camada por camada" presa a um produto:** usa o id fixo `"andris-burger"`. Se esse produto sumir ou mudar de id no banco, a seção quebra | `Anatomia.jsx` 19 |
| 6 | **Texto com dado fixo** que deveria vir de configuração: título e descrição de SEO, "Dona da Andri's", "A Andri's tá aqui", aviso da taxa citando "Andriele", crédito do rodapé | ver tabela da seção 1 |
| 7 | **Pagamentos fora de `data/`:** ficam em `lib/pedido.js` e os botões estão repetidos em `Comanda.jsx` 372–378. Mudar uma forma de pagamento exige mexer em dois arquivos | |
| 8 | **`INFOS-PENDENTES.md` desatualizado e com item duplicado:** "Água" aparece marcada como feita e de novo como pendente | `INFOS-PENDENTES.md` |
| 9 | **Cópia antiga do site no repositório:** `andris-burger-site.zip` (1,7 MB, 50 arquivos) na raiz. É uma segunda fonte de cardápio que pode divergir | raiz do repo |
| 10 | **X-Tudão** diz "hambúrguer" sem "bovino"; os outros dizem "hambúrguer bovino". Pendente de confirmação | `data/cardapio.js` |
| 11 | **Batata simples sem peso**, e a média tem "500 g". Pendente de confirmação | `data/cardapio.js` |

Nenhum produto está sem preço, e nenhum preço aparece repetido em componente.

---

## Como o seed foi montado

- `descricao`: os ingredientes, unidos do jeito que o site mostra ("a, b e c."). Nas porções, o campo `detalhe` (ex.: "500 g"). Nas bebidas, `null`.
- `foto`: preenchida só quando o arquivo existe em `public/` (`temFoto: true`). Nos outros produtos, `null`.
- Adicionais de lanche: grupo "Adicionais" com `min: 0`, `max: 6` em cada clássico e especial.
- Sabor e tipo de bebida: grupo com `min: 1`, `max: 1` e `preco_extra: 0`.
- `disponivel: true` em todos, porque o site não tem esse controle.
- `pagamentos`: as três opções que o site oferece hoje, ainda não confirmadas com a dona.
- `combos` e `bairros`: listas vazias, porque não existem no site.
- Segunda-feira entra com `abre` e `fecha` em `null` (fechado).
