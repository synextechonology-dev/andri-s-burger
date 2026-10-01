// Elementos gráficos da identidade visual (seção 05 do manual).

// Faíscas: três traços em leque que enquadram uma palavra de destaque.
export function Faiscas({ lado = "esquerda", className = "" }) {
  const espelho = lado === "direita" ? "scale(-1,1) translate(-40,0)" : undefined;
  return (
    <svg className={`faiscas ${className}`} viewBox="0 0 40 40" aria-hidden="true">
      <g transform={espelho} stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" fill="none">
        <path d="M6 9 L30 15" />
        <path d="M4 21 L30 21" />
        <path d="M6 33 L30 27" />
      </g>
    </svg>
  );
}

// Traço de pincel: sublinha a assinatura, como no logo.
export function TracoPincel({ className = "" }) {
  return (
    <svg className={`traco ${className}`} viewBox="0 0 300 18" preserveAspectRatio="none" aria-hidden="true">
      <path d="M4 12 C 70 7, 150 5, 296 4 L 294 10 C 160 11, 80 13, 6 17 Z" fill="currentColor" />
    </svg>
  );
}

// Preço no padrão do cardápio do manual: "R$" pequeno em cima, número grande embaixo.
export function Preco({ valor, className = "" }) {
  const inteiro = Math.floor(valor);
  const centavos = Math.round((valor - inteiro) * 100);
  return (
    <span className={`preco ${className}`} aria-label={`${inteiro} reais${centavos ? ` e ${centavos} centavos` : ""}`}>
      <span className="preco__moeda" aria-hidden="true">R$</span>
      <span className="preco__valor" aria-hidden="true">
        {inteiro}
        {centavos ? <small>,{String(centavos).padStart(2, "0")}</small> : null}
      </span>
    </span>
  );
}

// Espaço de foto. Enquanto a foto real não chega, mostra uma ilustração da marca
// (reserva) ou um quadro com gergelim. Em desenvolvimento, aparece também o
// caminho do arquivo esperado, para facilitar a troca.
const DEV = process.env.NODE_ENV !== "production";

export function Foto({ src, alt, temFoto = false, proporcao = "4 / 3", className = "", prioridade = false, reserva = null, legenda = null }) {
  if (temFoto && src) {
    return (
      <div className={`foto ${className}`} style={{ aspectRatio: proporcao }}>
        {/* Troque por next/image quando as fotos reais estiverem em /public */}
        <img src={src} alt={alt} loading={prioridade ? "eager" : "lazy"} />
      </div>
    );
  }
  return (
    <div
      className={`foto foto--vazia ${reserva ? "foto--ilustrada" : ""} ${className}`}
      style={{ aspectRatio: proporcao }}
      role="img"
      aria-label={alt}
    >
      {reserva}
      {legenda ? <span className="foto__rotulo">{legenda}</span> : null}
      {DEV && src ? <span className="foto__arquivo">{src}</span> : null}
    </div>
  );
}
