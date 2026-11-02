import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { brl } from "@/lib/format";
import { nuvemshopCartCheckout } from "@/lib/nuvemshop.functions";

export const Route = createFileRoute("/carrinho")({ component: CartPage });
function CartPage() {
  const { realItems, subtotal, setRealQty, removeReal } = useCart();
  const [loading, setLoading] = useState(false);
  const checkout = async () => {
    if (loading || !realItems.length) return;
    setLoading(true);
    try {
      const result = await nuvemshopCartCheckout({ data: { items: realItems.map(i => ({ productId: i.productId, variantId: i.variantId, quantity: i.qty })) } });
      window.location.assign(result.checkoutUrl);
    } catch {
      toast.error("Não foi possível iniciar o checkout. Tente novamente.");
      setLoading(false);
    }
  };
  if (!realItems.length) return <div className="mx-auto max-w-xl px-4 py-24 text-center"><ShoppingBag className="mx-auto h-9 w-9" strokeWidth={1.4}/><h1 className="mt-6 text-3xl">Seu carrinho está vazio</h1><Link to="/" className="btn-solid mt-8">Explorar produtos</Link></div>;
  return <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
    <h1 className="text-3xl md:text-4xl">Carrinho</h1>
    <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_380px]">
      <ul className="divide-y border-y">{realItems.map(i => <li key={i.variantId} className="flex gap-4 py-6">
        <Link to="/produto/$slug" params={{slug:i.handle}} className="w-24 shrink-0 bg-secondary md:w-28">{i.image && <img src={i.image} alt={i.name} className="aspect-[4/5] w-full object-cover"/>}</Link>
        <div className="flex flex-1 flex-col">
          <div className="flex justify-between gap-2">
            <div><Link to="/produto/$slug" params={{slug:i.handle}} className="text-sm hover:underline">{i.name}</Link>{i.variantLabel && <p className="mt-1 text-xs text-muted-foreground">{i.variantLabel}</p>}</div>
            <button aria-label="Remover" onClick={() => removeReal(i.variantId)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4"/></button>
          </div>
          <div className="mt-auto flex items-end justify-between pt-4">
            <div className="inline-flex h-9 items-center border">
              <button aria-label="Diminuir" className="px-3" onClick={() => setRealQty(i.variantId, i.qty - 1)}><Minus className="h-3 w-3"/></button>
              <span className="w-6 text-center text-sm">{i.qty}</span>
              <button aria-label="Aumentar" className="px-3" onClick={() => setRealQty(i.variantId, i.qty + 1)}><Plus className="h-3 w-3"/></button>
            </div>
            <span className="font-semibold">{brl(i.price * i.qty)}</span>
          </div>
        </div>
      </li>)}</ul>
      <aside className="h-fit bg-secondary p-6 lg:sticky lg:top-28">
        <p className="eyebrow">Resumo</p>
        <div className="mt-6 flex justify-between text-sm"><span>Subtotal estimado</span><span className="font-semibold">{brl(subtotal)}</span></div>
        <p className="mt-3 text-xs text-muted-foreground">Preço, disponibilidade, frete e descontos serão confirmados no checkout da Nuvemshop.</p>
        <button type="button" onClick={checkout} disabled={loading} className="btn-solid mt-6 w-full">{loading ? "Abrindo checkout..." : "Finalizar compra"}</button>
        <Link to="/" className="mt-4 block text-center text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">Continuar comprando</Link>
      </aside>
    </div>
  </div>;
}
