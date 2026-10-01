import { site } from "@/data/site";
import { TracoPincel } from "./Marca";

export default function Rodape() {
  return (
    <footer className="rodape tema-amarelo gergelim">
      <div className="rodape__interno">
        <p className="rodape__fechamento">
          {/* hífen que não quebra: "apaixone-se" fica inteiro na mesma linha */}
          <span>{site.textos.fechamento.replace("-", "\u2011")}</span>
          <TracoPincel />
        </p>

        <div className="rodape__colunas">
          <img className="rodape__selo" src="/marca/selo-recortado.png" alt="" width="640" height="640" />
          <a href="#cardapio" className="botao botao--preto rodape__pedir">
            {site.textos.pedido}
          </a>
          <ul className="rodape__links">
            <li>
              <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer">
                WhatsApp {site.whatsappExibicao}
              </a>
            </li>
            <li>
              <a href={site.instagram} target="_blank" rel="noopener noreferrer">
                Instagram {site.instagramUsuario}
              </a>
            </li>
            <li>
              <a href={site.mapaUrl} target="_blank" rel="noopener noreferrer">
                {site.endereco.rua}, {site.endereco.cidade}
              </a>
            </li>
          </ul>
        </div>

        <p className="rodape__marca" aria-hidden="true">
          <span className="rodape__marca-assinatura">Andri's</span>
          <span className="rodape__marca-burger">Burger</span>
        </p>

        <p className="rodape__credito">
          © {new Date().getFullYear()} Andri's Burger. Site feito pela Synex.
        </p>
      </div>
    </footer>
  );
}
