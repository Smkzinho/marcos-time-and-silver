import { Link } from "@tanstack/react-router";
import { categories } from "@/services/catalog";
import { store } from "@/config/store";
import { Logo } from "./Logo";
import { commerce } from "@/data/commerce";

const h = "eyebrow mb-5 text-primary-foreground";
const a = "text-sm text-muted-foreground transition-colors hover:text-primary-foreground";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-4 md:px-8">
        <div>
          <Logo inverted />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted-foreground">{store.about}</p>
        </div>
        <div>
          <p className={h}>Categorias</p>
          <ul className="space-y-3">
            {categories.map((c) => (
              <li key={c.slug}><Link to="/categoria/$slug" params={{ slug: c.slug }} className={a}>{c.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className={h}>Institucional</p>
          <ul className="space-y-3">
            <li><Link to="/info/$slug" params={{ slug: "atendimento" }} className={a}>Atendimento</Link></li>
            <li><Link to="/info/$slug" params={{ slug: "privacidade" }} className={a}>Política de privacidade</Link></li>
            <li><Link to="/info/$slug" params={{ slug: "trocas" }} className={a}>Trocas e devoluções</Link></li>
            <li><Link to="/info/$slug" params={{ slug: "termos" }} className={a}>Termos de uso</Link></li>
          </ul>
        </div>
        <div>
          <p className={h}>Contato</p>
          <ul className="space-y-3">
            <li>{store.instagram.url ? <a href={store.instagram.url} target="_blank" rel="noreferrer" className={a}>Instagram {store.instagram.handle}</a> : <span className={a}>Instagram — a configurar</span>}</li>
            <li>{store.whatsapp.url ? <a href={store.whatsapp.url} target="_blank" rel="noreferrer" className={a}>WhatsApp {store.whatsapp.number}</a> : <span className={a}>WhatsApp — a configurar</span>}</li>
          </ul>
          {commerce.paymentMethods.length > 0 && (
            <>
              <p className={`${h} mt-8`}>Formas de pagamento</p>
              <p className="text-sm text-muted-foreground">{commerce.paymentMethods.join(" · ")}</p>
            </>
          )}
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <p className="mx-auto max-w-7xl px-4 py-6 text-xs text-muted-foreground md:px-8">
          © {new Date().getFullYear()} {store.name}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
