import { Link } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";
import { categories } from "@/data/catalog";
import { useCart } from "@/lib/cart";
import { Logo } from "./Logo";

const nav = [
  { label: "Início", to: "/" as const },
  ...categories.map((c) => ({ label: c.menuName, slug: c.slug })),
];

export function Header() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  const linkCls = "text-[0.7rem] font-medium uppercase tracking-[0.18em] text-foreground/80 transition-colors hover:text-foreground";

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:h-20 md:px-8">
        <button className="lg:hidden" aria-label="Abrir menu" onClick={() => setOpen(true)}>
          <Menu className="h-5 w-5" strokeWidth={1.5} />
        </button>
        <Logo />
        <nav className="hidden items-center gap-7 lg:flex">
          {nav.map((n) =>
            "slug" in n ? (
              <Link key={n.slug} to="/categoria/$slug" params={{ slug: n.slug! }} className={linkCls} activeProps={{ className: "!text-foreground" }}>
                {n.label}
              </Link>
            ) : (
              <Link key="home" to="/" className={linkCls}>{n.label}</Link>
            ),
          )}
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/busca" aria-label="Pesquisar"><Search className="h-5 w-5" strokeWidth={1.5} /></Link>
          <Link to="/conta" aria-label="Minha conta" className="hidden sm:block"><User className="h-5 w-5" strokeWidth={1.5} /></Link>
          <Link to="/carrinho" aria-label="Carrinho" className="relative">
            <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[0.6rem] font-semibold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40 animate-in fade-in" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-[82%] max-w-sm flex-col bg-background p-6 animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between">
              <Logo />
              <button aria-label="Fechar menu" onClick={() => setOpen(false)}><X className="h-5 w-5" strokeWidth={1.5} /></button>
            </div>
            <nav className="mt-10 flex flex-col">
              {nav.map((n) =>
                "slug" in n ? (
                  <Link key={n.slug} to="/categoria/$slug" params={{ slug: n.slug! }} onClick={() => setOpen(false)} className="border-b py-4 text-sm uppercase tracking-[0.18em]">
                    {n.label}
                  </Link>
                ) : (
                  <Link key="home" to="/" onClick={() => setOpen(false)} className="border-b py-4 text-sm uppercase tracking-[0.18em]">{n.label}</Link>
                ),
              )}
              <Link to="/conta" onClick={() => setOpen(false)} className="py-4 text-sm uppercase tracking-[0.18em] text-muted-foreground">Minha conta</Link>
            </nav>
          </aside>
        </div>
      )}
    </header>
  );
}
