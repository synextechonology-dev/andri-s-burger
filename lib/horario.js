import { horarios } from "@/data/site";

const FUSO = "America/Sao_Paulo";

function agoraNoFuso(data = new Date()) {
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: FUSO,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(data);
  const pega = (t) => partes.find((p) => p.type === t)?.value;
  const dias = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return {
    dia: dias[pega("weekday")],
    minutos: Number(pega("hour")) * 60 + Number(pega("minute")),
  };
}

const emMinutos = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

// "19:30" -> "19h30", "23:00" -> "23h"
export function formataHora(hhmm) {
  const [h, m] = hhmm.split(":");
  return m === "00" ? `${Number(h)}h` : `${Number(h)}h${m}`;
}

// Situação da chapa agora: aberta, abre mais tarde hoje, ou próximo dia aberto.
export function situacaoAgora(data = new Date()) {
  const { dia, minutos } = agoraNoFuso(data);
  const hoje = horarios.find((h) => h.dia === dia);

  if (hoje?.abre) {
    const abre = emMinutos(hoje.abre);
    const fecha = emMinutos(hoje.fecha);
    if (minutos >= abre && minutos < fecha) {
      return { aberto: true, texto: `Chapa ligada até as ${formataHora(hoje.fecha)}`, dia };
    }
    if (minutos < abre) {
      return { aberto: false, texto: `Chapa desligada. Hoje a gente abre às ${formataHora(hoje.abre)}`, dia };
    }
  }

  for (let i = 1; i <= 7; i++) {
    const proximo = horarios.find((h) => h.dia === (dia + i) % 7);
    if (proximo?.abre) {
      const quando = i === 1 ? "amanhã" : proximo.nome.toLowerCase();
      return { aberto: false, texto: `Chapa desligada. Abre ${quando} às ${formataHora(proximo.abre)}`, dia };
    }
  }
  return { aberto: false, texto: "Chapa desligada", dia };
}
