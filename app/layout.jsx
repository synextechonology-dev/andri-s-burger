import { Bebas_Neue, Kaushan_Script, Barlow } from "next/font/google";
import "./globals.css";

// Tipografia do manual (seção 04):
// Kaushan Script = assinatura, Bebas Neue = títulos e preços, Barlow = texto.
const kaushan = Kaushan_Script({ weight: "400", subsets: ["latin"], variable: "--fonte-assinatura", display: "swap" });
const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--fonte-titulo", display: "swap" });
const barlow = Barlow({ weight: ["400", "600", "700"], subsets: ["latin"], variable: "--fonte-texto", display: "swap" });

export const metadata = {
  title: "Andri's Burger | Food truck em Camboriú",
  description:
    "Sabor que vicia, qualidade que fideliza! Hambúrguer de chapa no food truck da Andri's Burger, em Camboriú. Peça pelo site e receba ou retire.",
  openGraph: {
    title: "Andri's Burger | Food truck em Camboriú",
    description: "Monte sua comanda e peça pelo WhatsApp. Retirada no food truck ou entrega.",
    locale: "pt_BR",
    type: "website",
    images: ["/marca/selo.png"],
  },
};

export const viewport = {
  themeColor: "#0D0D0D",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${kaushan.variable} ${bebas.variable} ${barlow.variable}`}>
      <body>{children}</body>
    </html>
  );
}
