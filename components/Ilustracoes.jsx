// Ilustrações desenhadas em SVG, só com as cores do manual.
// Servem de lanche "camada por camada" e de espaço reservado bonito
// enquanto as fotos reais não chegam.

const C = {
  amarelo: "#F6B90E",
  queijo: "#FFD54A",
  preto: "#0D0D0D",
  guardanapo: "#F5F1E8",
  marrom: "#5A3220",
  marromEscuro: "#3A1F14",
  carvao: "#1C1A17",
  painel: "#2A2723",
};

// Linha ondulada de x0 a x1 na altura y (usada em alface, bacon e maionese).
function onda(x0, x1, y, amp, n, fase = 0) {
  const passo = (x1 - x0) / n;
  let d = "";
  for (let i = 0; i < n; i++) {
    const xa = x0 + i * passo;
    const sobe = (i + fase) % 2 === 0 ? -amp : amp;
    d += ` Q ${xa + passo / 2} ${y + sobe} ${xa + passo} ${y}`;
  }
  return d;
}

// Altura de cada camada no viewBox (largura sempre 320).
export const ALTURAS = {
  "pao-topo": 112,
  maionese: 26,
  alface: 34,
  cebola: 26,
  bacon: 28,
  hamburguer: 54,
  cheddar: 38,
  "pao-base": 54,
};

function Gergelim() {
  const sementes = [
    [92, 52, -30], [130, 34, -10], [168, 28, 12], [206, 38, 28], [240, 58, 40],
    [112, 74, 18], [152, 60, -22], [192, 70, 6], [76, 80, -42], [226, 84, -14],
  ];
  return sementes.map(([x, y, r], i) => (
    <ellipse key={i} cx={x} cy={y} rx="4.2" ry="8" fill={C.guardanapo} transform={`rotate(${r} ${x} ${y})`} />
  ));
}

export function Camada({ tipo, className = "" }) {
  const h = ALTURAS[tipo];
  let corpo = null;

  switch (tipo) {
    case "pao-topo":
      corpo = (
        <>
          <path d="M14 104 C14 38 82 6 160 6 C238 6 306 38 306 104 Z" fill={C.amarelo} stroke={C.preto} strokeWidth="4" />
          <path d="M44 84 C50 46 98 22 150 18" stroke={C.queijo} strokeWidth="10" strokeLinecap="round" fill="none" opacity="0.9" />
          <Gergelim />
        </>
      );
      break;
    case "maionese":
      corpo = (
        <path
          d={`M18 6 H302 C304 12 300 16 294 16 ${onda(294, 26, 16, 7, 9)} C20 16 16 12 18 6 Z`}
          fill={C.guardanapo}
          stroke={C.preto}
          strokeWidth="3"
        />
      );
      break;
    case "alface":
      corpo = (
        <path
          d={`M8 17 ${onda(8, 312, 6, 8, 14)} L312 17 ${onda(312, 8, 28, 8, 14, 1)} Z`}
          fill={C.painel}
          stroke={C.guardanapo}
          strokeWidth="3"
          strokeLinejoin="round"
        />
      );
      break;
    case "cebola":
      corpo = (
        <g fill="rgba(245,241,232,0.12)" stroke={C.guardanapo} strokeWidth="3.5">
          <ellipse cx="88" cy="13" rx="62" ry="9" />
          <ellipse cx="160" cy="13" rx="62" ry="9" />
          <ellipse cx="232" cy="13" rx="62" ry="9" />
        </g>
      );
      break;
    case "bacon":
      corpo = (
        <>
          <path
            d={`M14 8 ${onda(14, 306, 8, 6, 8)} L306 20 ${onda(306, 14, 20, 6, 8, 1)} Z`}
            fill={C.marrom}
            stroke={C.preto}
            strokeWidth="3"
          />
          <path d={`M22 14 ${onda(22, 298, 14, 6, 8)}`} stroke={C.queijo} strokeWidth="3" fill="none" opacity="0.85" />
        </>
      );
      break;
    case "hamburguer":
      corpo = (
        <>
          <rect x="12" y="5" width="296" height="44" rx="22" fill={C.marrom} stroke={C.preto} strokeWidth="4" />
          <g stroke={C.marromEscuro} strokeWidth="5" strokeLinecap="round">
            <path d="M58 18 L86 34" />
            <path d="M118 16 L146 34" />
            <path d="M178 16 L206 34" />
            <path d="M238 18 L262 32" />
          </g>
          <path d="M34 14 C80 9 140 8 200 9" stroke="#7A4A33" strokeWidth="4" strokeLinecap="round" fill="none" />
        </>
      );
      break;
    case "cheddar":
      corpo = (
        <path
          d="M16 4 H304 L298 14 L284 14 L276 30 C274 36 266 36 264 30 L256 14 L200 14 L192 34 C190 40 182 40 180 34 L172 14 L110 14 L102 26 C100 31 93 31 91 26 L84 14 L22 14 Z"
          fill={C.queijo}
          stroke={C.preto}
          strokeWidth="3"
          strokeLinejoin="round"
        />
      );
      break;
    case "pao-base":
      corpo = (
        <>
          <path d="M14 6 H306 C306 36 286 50 254 50 H66 C34 50 14 36 14 6 Z" fill={C.amarelo} stroke={C.preto} strokeWidth="4" />
          <path d="M40 16 H280" stroke={C.queijo} strokeWidth="5" strokeLinecap="round" opacity="0.8" />
        </>
      );
      break;
    default:
      return null;
  }

  return (
    <svg className={`camada camada--${tipo} ${className}`} viewBox={`0 0 320 ${h}`} aria-hidden="true" focusable="false">
      {corpo}
    </svg>
  );
}

// Lanche montado (usado como espaço reservado das fotos dos especiais).
const MONTADO = ["pao-topo", "alface", "cheddar", "hamburguer", "pao-base"];
export function BurgerMontado({ camadas = MONTADO, className = "" }) {
  return (
    <div className={`burger-montado ${className}`} aria-hidden="true">
      {camadas.map((t, i) => (
        <Camada key={i} tipo={t} />
      ))}
    </div>
  );
}

// Caixa de batata frita.
export function Batata({ className = "" }) {
  const palitos = [
    [92, 40, -10], [114, 22, -4], [136, 30, 3], [158, 14, -2], [180, 26, 5], [202, 18, 8], [224, 36, 12],
    [104, 54, 6], [148, 44, -8], [192, 48, 2], [216, 58, -6],
  ];
  return (
    <svg className={`ilustracao ${className}`} viewBox="0 0 320 340" aria-hidden="true" focusable="false">
      {palitos.map(([x, y, r], i) => (
        <rect key={i} x={x} y={y} width="20" height="150" rx="5" fill={i % 3 ? C.queijo : C.amarelo} stroke={C.preto} strokeWidth="3.5" transform={`rotate(${r} ${x + 10} ${y + 150})`} />
      ))}
      <path d="M60 140 H260 L238 320 H82 Z" fill={C.preto} stroke={C.preto} strokeWidth="4" strokeLinejoin="round" />
      <path d="M66 176 H254 L250 206 H70 Z" fill={C.amarelo} />
      <text x="160" y="268" textAnchor="middle" fontFamily="var(--fonte-titulo)" fontSize="58" fill={C.amarelo}>A</text>
    </svg>
  );
}

// O food truck, de lado.
export function Truck({ className = "" }) {
  return (
    <svg className={`ilustracao ${className}`} viewBox="0 0 640 340" aria-hidden="true" focusable="false">
      <rect x="40" y="70" width="470" height="200" rx="26" fill={C.preto} stroke={C.guardanapo} strokeWidth="4" />
      <path d="M510 130 H560 C584 130 600 150 604 176 L612 236 C613 254 602 270 584 270 H510 Z" fill={C.preto} stroke={C.guardanapo} strokeWidth="4" />
      <path d="M528 146 H556 C570 146 580 156 582 170 L586 196 H528 Z" fill={C.carvao} stroke={C.guardanapo} strokeWidth="3" />
      <rect x="40" y="70" width="470" height="34" rx="16" fill={C.amarelo} />
      <rect x="40" y="88" width="470" height="16" fill={C.amarelo} />
      {/* toldo */}
      <path d={`M120 118 H420 V140 ${onda(420, 120, 140, 9, 10)} Z`} fill={C.amarelo} stroke={C.preto} strokeWidth="3" />
      {/* janela */}
      <rect x="128" y="146" width="284" height="80" rx="8" fill={C.carvao} stroke={C.guardanapo} strokeWidth="3" />
      <rect x="128" y="146" width="284" height="80" rx="8" fill="url(#luz-truck)" />
      <rect x="116" y="226" width="308" height="12" rx="4" fill={C.guardanapo} />
      <text x="275" y="96" textAnchor="middle" fontFamily="var(--fonte-titulo)" fontSize="30" letterSpacing="2" fill={C.preto}>ANDRI'S BURGER</text>
      <g>
        <circle cx="150" cy="276" r="38" fill={C.preto} stroke={C.guardanapo} strokeWidth="4" />
        <circle cx="150" cy="276" r="14" fill={C.amarelo} />
        <circle cx="520" cy="276" r="38" fill={C.preto} stroke={C.guardanapo} strokeWidth="4" />
        <circle cx="520" cy="276" r="14" fill={C.amarelo} />
      </g>
      <defs>
        <radialGradient id="luz-truck" cx="0.5" cy="0.3" r="0.7">
          <stop offset="0" stopColor={C.amarelo} stopOpacity="0.45" />
          <stop offset="1" stopColor={C.amarelo} stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
