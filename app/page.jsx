import { ComandaProvider } from "@/components/ComandaContext";
import Cabecalho from "@/components/Cabecalho";
import Abertura from "@/components/Abertura";
import Cardapio from "@/components/Cardapio";
import FoodTruck from "@/components/FoodTruck";
import Letreiro from "@/components/Letreiro";
import Anatomia from "@/components/Anatomia";
import ComoPedir from "@/components/ComoPedir";
import OndeQuando from "@/components/OndeQuando";
import Rodape from "@/components/Rodape";
import Comanda, { BarraComanda } from "@/components/Comanda";

// Ordem dos fundos (alterna as cores do manual):
// preto (abertura) > amarelo (letreiro) > carvão (camada por camada)
// > guardanapo (pedir é assim) > preto (clássicos) > carvão (especiais)
// > guardanapo (porções) > amarelo (bebidas) > preto (food truck)
// > guardanapo (onde e quando) > amarelo (rodapé)
export default function Home() {
  return (
    <ComandaProvider>
      <a className="pular" href="#cardapio">
        Pular para o cardápio
      </a>
      <Cabecalho />
      <main>
        <Abertura />

        <Letreiro />
        <Anatomia />
        <ComoPedir />
        <Cardapio />
        <FoodTruck />
        <OndeQuando />
      </main>
      <Rodape />
      <BarraComanda />
      <Comanda />
    </ComandaProvider>
  );
}
