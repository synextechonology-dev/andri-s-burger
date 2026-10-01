"use client";

import { useEffect, useState } from "react";
import { situacaoAgora } from "@/lib/horario";

// Mostra se o food truck está aberto agora. Calculado só no navegador
// (evita diferença entre o horário do servidor e o da pessoa).
export default function StatusChapa({ className = "" }) {
  const [situacao, setSituacao] = useState(null);

  useEffect(() => {
    const atualiza = () => setSituacao(situacaoAgora());
    atualiza();
    const t = setInterval(atualiza, 60_000);
    return () => clearInterval(t);
  }, []);

  if (!situacao) return <span className={`status ${className}`} aria-hidden="true">&nbsp;</span>;

  return (
    <span className={`status ${situacao.aberto ? "status--aberto" : "status--fechado"} ${className}`}>
      <span className="status__luz" aria-hidden="true" />
      {situacao.texto}
    </span>
  );
}
