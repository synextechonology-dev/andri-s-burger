# Identidade visual: Andri's Burger (para o painel do SaaS)

Levantamento feito só por leitura do código, sem alterar nenhum arquivo do site.

- Repositório: `synextechonology-dev/andri-s-burger`, commit `6a3f0c5` (11/10/2026).
- Fontes da informação: `app/globals.css` (tokens em `:root`), `components/Ilustracoes.jsx` (paleta das ilustrações), `app/layout.jsx` e os arquivos de imagem em `app/` e `public/marca/`.
- O manual de marca original está em `docs/Identidade_visual_Andris_Burger.pdf`.

---

## 1. Logo

### Arquivos encontrados

| Arquivo | Formato | Tamanho | Peso | Fundo | O que é |
|---|---|---|---|---|---|
| `public/marca/selo.png` | PNG RGB (sem transparência) | 640 × 640 px | 330 KB | quadrado preto | Selo completo: hambúrguer + "Andri's" + "BURGER" + espátula e garfo, dentro de um anel amarelo |
| `public/marca/selo-recortado.png` | PNG RGBA (com transparência) | 640 × 640 px | 372 KB | transparente fora do círculo | O mesmo selo recortado em círculo. É o que o site usa na abertura e no rodapé |
| `app/icon.png` | PNG RGBA | 256 × 256 px | 84 KB | transparente fora do círculo | Favicon: o selo recortado reduzido |
| `app/apple-icon.png` | PNG RGBA | 180 × 180 px | 46 KB | transparente fora do círculo | Ícone para iPhone: o mesmo selo reduzido |

**Não existe logo em SVG.** A assinatura do cabeçalho ("Andri's" em Kaushan + "Burger" em Bebas) é texto com fonte, não arquivo. Os SVGs do projeto (`components/Marca.jsx` e `components/Ilustracoes.jsx`) são elementos gráficos (faíscas, traço de pincel, camadas do lanche), não logo.

**Não existe o monograma "A" em arquivo.** Ele aparece no manual em PDF (seção Logotipo, indicado para "espaços pequenos: favicon, adesivo, lacre"), mas não foi exportado para o site.

### Fundo claro x fundo escuro

| Arquivo | Sobre fundo claro | Sobre fundo escuro |
|---|---|---|
| `selo.png` | ⚠️ Aparece como um quadrado preto com cantos visíveis | ✅ Os cantos pretos somem no fundo escuro |
| `selo-recortado.png` | ✅ O selo traz o próprio disco preto, então funciona sozinho | ✅ O anel amarelo separa o selo do fundo |
| `app/icon.png` | ✅ Igual ao recortado | ✅ Igual ao recortado |
| `app/apple-icon.png` | ✅ Igual ao recortado | ✅ Igual ao recortado |

O selo é sempre preto com amarelo e branco, então não precisa de versão invertida para fundo claro.

### Melhor versão para 38 px num círculo

**Recomendado: `app/icon.png`** (256 × 256 px, PNG com transparência, 84 KB).

- Já é circular e transparente fora do círculo, então encaixa num avatar redondo sem cantos.
- 256 px cobre telas de alta densidade (38 px × 3 = 114 px) com folga, com um quarto do peso do `selo-recortado.png`.

⚠️ **Aviso:** só existe a logo completa com texto. Em 38 px dá para reconhecer o hambúrguer e o "Andri's", mas o "BURGER" fica muito pequeno para ler. A versão ideal para esse tamanho seria o monograma "A" do manual, que precisa ser exportado do PDF ou redesenhado em SVG.

---

## 2. Cores

### Cores da marca (tokens em `app/globals.css`, `:root`, linhas 2–7)

| Nome | Variável | Hex | Onde é usada |
|---|---|---|---|
| **Amarelo Andri's** | `--amarelo` | `#F6B90E` | Logo, preços, botão principal (com texto preto), faixas, faíscas, traço de pincel, número da comanda. 63 usos no CSS |
| **Preto Chapa** | `--preto` | `#0D0D0D` | Fundo principal, texto sobre amarelo, botão secundário (com texto amarelo), `themeColor` do navegador. 60 usos |
| Branco Guardanapo | `--guardanapo` | `#F5F1E8` | Texto e assinatura sobre preto, fundo das seções claras, papel da comanda. 23 usos |
| Carvão | `--carvao` | `#1C1A17` | Superfícies e cartões sobre o preto, fundo das seções "carvão". 7 usos |
| Marrom Blend | `--marrom` | `#5A3220` | Apoio pontual (linhas, quantidade na comanda). O manual diz "nunca fundo". 4 usos |
| Amarelo Queijo | `--queijo` | `#FFD54A` | Padrão gergelim, hover do botão amarelo, brilhos. 3 usos |

Proporção de uso pelo manual: preto 55%, amarelo 25%, guardanapo 12%, marrom 8%.

### Cores de apoio (fora da marca, só técnicas)

| Hex | Onde |
|---|---|
| `#2A2723`, `#24211D`, `#3A3631`, `#3A3530`, `#4A453E` | Tons de metal da porta de enrolar e da moldura da janela (`globals.css`) |
| `#3A1F14`, `#7A4A33` | Sombra e detalhe do marrom nas ilustrações (`Ilustracoes.jsx`) |
| `#6B655C`, `#9A948A` | Luz apagada do status "chapa desligada" |
| `#8A1F0C` | Texto de erro do formulário |
| `#FFFDF8`, `#FFFFFF` | Fundo dos campos da comanda e cartão de horários |

### Cor principal

**Amarelo Andri's `#F6B90E`.** O manual chama de "cor-assinatura" e diz que "o amarelo é o do queijo derretendo". É a cor do anel do logo e do "BURGER". O preto é o fundo, mas é o amarelo que identifica a Andri's.

---

## 3. Cor de destaque para o painel

Regra do painel: botão com **texto branco** (`#FFFFFF`), sobre fundo claro (`#F5F3EF`) e sobre modo escuro (`#121212`).

Metas (WCAG 2.1):
- Texto branco sobre o botão: **≥ 4,5:1** (texto normal).
- Botão contra o fundo da página: **≥ 3:1** (contorno de componente). É recomendado, não obrigatório, para o botão se destacar do fundo.

### Contraste das cores da marca

| Cor | Hex | Texto branco | Fundo claro `#F5F3EF` | Fundo escuro `#121212` | Passa com texto branco? |
|---|---|---|---|---|---|
| Amarelo Andri's | `#F6B90E` | 1,77 : 1 | 1,60 : 1 | 10,58 : 1 | 🔴 Não |
| Amarelo Queijo | `#FFD54A` | 1,41 : 1 | 1,27 : 1 | 13,26 : 1 | 🔴 Não |
| Branco Guardanapo | `#F5F1E8` | 1,13 : 1 | 1,02 : 1 | 16,62 : 1 | 🔴 Não |
| Marrom Blend | `#5A3220` | 10,98 : 1 | 9,91 : 1 | 1,71 : 1 | 🟡 Sim, mas some no modo escuro |
| Preto Chapa | `#0D0D0D` | 19,44 : 1 | 17,54 : 1 | 1,04 : 1 | 🟡 Sim, mas some no modo escuro |
| Carvão | `#1C1A17` | 17,36 : 1 | 15,67 : 1 | 1,08 : 1 | 🟡 Sim, mas some no modo escuro |

A cor principal (`#F6B90E`) **não passa** com texto branco. No site, o botão amarelo sempre usa texto preto (10,98 : 1).

### Variações escuras do Amarelo Andri's

Mesmo matiz (44°) e mesma saturação (93%), escurecendo só a luminosidade:

| Hex | Luminosidade | Texto branco | Fundo claro | Fundo escuro | Resultado |
|---|---|---|---|---|---|
| `#A16F00` | 31,6% | 4,38 : 1 | 3,96 : 1 | 4,27 : 1 | 🔴 Não chega a 4,5 |
| **`#957006`** | **30,4%** | **4,57 : 1** | **4,12 : 1** | **4,10 : 1** | ✅ **Primeiro tom que passa** |
| `#8F6500` | 28% | 5,21 : 1 | 4,70 : 1 | 3,59 : 1 | ✅ Mais folga no texto, menos destaque no escuro |
| `#8A6100` | 27% | 5,54 : 1 | 5,00 : 1 | 3,38 : 1 | ✅ Passa, mas já puxa para o marrom |

### Recomendação

**`#957006`**: é o tom mais próximo do Amarelo Andri's que passa com texto branco.

- Texto branco: **4,57 : 1** (meta 4,5).
- Contra o fundo claro `#F5F3EF`: 4,12 : 1. Contra o modo escuro `#121212`: 4,10 : 1. Os dois passam de 3 : 1, então o botão se destaca igual nos dois temas.
- Margem curta: 4,57 está bem perto de 4,5. Se o painel usar texto pequeno ou fino no botão, `#8F6500` (5,21 : 1) é a opção mais segura, mas fica com menos destaque no modo escuro (3,59 : 1).

⚠️ **Sobre a fidelidade à marca:** qualquer amarelo escuro o bastante para texto branco vira **mostarda**. Ele lembra a Andri's, mas não é o amarelo vivo do logo. Se o painel um dia permitir **texto escuro no botão**, o próprio `#F6B90E` com texto `#0D0D0D` (10,98 : 1), como o site já faz, é a combinação mais fiel à marca.
