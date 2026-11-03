import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getProduct } from "@/services/catalog";
import { brl, installmentText } from "@/lib/format";
import { useCart } from "@/lib/cart";
import { startNuvemshopCheckout } from "@/services/nuvemshop/checkout.functions";
import { toCheckoutLines } from "@/services/checkout";
import { commerce } from "@/data/commerce";

export const Route = createFileRoute("/carrinho")({
  head: () => ({
    meta: [
      { title: "Carrinho — Marcos Joias & Relógios" },
      { name: "description", content: "Revise os produtos do seu carrinho." },
      { property: "og:title", content: "Carrinho — Marcos Joias & Relógios" },
      { property: "og:description", content: "Revise os produtos do seu carrinho." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, subtotal, setQty, remove } = useCart();
  const [coupon, setCoupon] = useState("");
  const [loading, setLoading] = useState(false);

  const checkout = async () => {
    setLoading(true);
    try {
      const r = await startNuvemshopCheckout({ data: { items: toCheckoutLines(items, getProduct), ...(coupon ? { coupon } : {}) } });
      if (r.checkoutUrl) window.location.href = r.checkoutUrl;
      else toast("Checkout em preparação", { description: "A finalização de compra será habilitada após a integração com a Nuvemshop." });
    } catch {
      toast.error("Não foi possível iniciar o checkout.");
    } finally {
      setLoading(false);
    }
  };

  if (!items.length)
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-3xl">Seu carrinho está vazio</h1>
        <p className="mt-3 text-sm text-muted-foreground">Explore a coleção e encontre a peça ideal.</p>
        <Link to="/" className="btn-solid mt-8">Ver produtos</Link>
      </div>
    );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
      <h1 className="text-3xl md:text-4xl">Carrinho</h1>
      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_380px]">
        <ul className="divide-y border-y">
          {items.map((i) => {
            const p = getProduct(i.slug)!;
            return (
              <li key={i.slug + i.variant} className="flex gap-4 py-6">
                <Link to="/produto/$slug" params={{ slug: p.slug }} className="w-24 shrink-0 bg-secondary md:w-28">
                  <img src={p.images[0]} alt={p.name} className="aspect-[4/5] w-full object-cover" />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-2">
                    <div>
                      <Link to="/produto/$slug" params={{ slug: p.slug }} className="text-sm hover:underline">{p.name}</Link>
                      {i.variant && <p className="mt-1 text-xs text-muted-foreground">{p.variants?.label}: {i.variant}</p>}
                    </div>
                    <button aria-label="Remover" onClick={() => remove(i.slug, i.variant)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
                  </div>
                  <div className="mt-auto flex items-end justify-between pt-4">
                    <div className="inline-flex h-9 items-center border">
                      <button aria-label="Diminuir" className="px-3" onClick={() => setQty(i.slug, i.variant, i.qty - 1)}><Minus className="h-3 w-3" /></button>
                      <span className="w-6 text-center text-sm">{i.qty}</span>
                      <button aria-label="Aumentar" className="px-3" onClick={() => setQty(i.slug, i.variant, Math.min(99, i.qty + 1))}><Plus className="h-3 w-3" /></button>
                    </div>
                    <span className="font-semibold">{brl(p.price * i.qty)}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="h-fit bg-secondary p-6 lg:sticky lg:top-28">
          <p className="eyebrow">Resumo</p>
          <div className="mt-6 flex justify-between text-sm"><span>Subtotal</span><span className="font-semibold">{brl(subtotal)}</span></div>
          <p className="mt-1 text-right text-xs text-muted-foreground">{installmentText(subtotal)}</p>
          <p className="mt-3 text-xs text-muted-foreground">{commerce.cartShippingNote}</p>
          <form className="mt-6 flex" onSubmit={(e) => { e.preventDefault(); toast("Cupom registrado", { description: "Será validado na finalização da compra." }); }}>
            <input value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase().slice(0, 40))} placeholder="Cupom de desconto" className="h-11 flex-1 border bg-background px-3 text-sm outline-none focus:border-foreground" />
            <button className="h-11 border border-l-0 bg-background px-4 text-xs uppercase tracking-widest">Aplicar</button>
          </form>
          <button onClick={checkout} disabled={loading} className="btn-solid mt-6 w-full">{loading ? "Aguarde..." : "Finalizar compra"}</button>
          <Link to="/" className="mt-4 block text-center text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">Continuar comprando</Link>
        </aside>
      </div>
    </div>
  );
}
