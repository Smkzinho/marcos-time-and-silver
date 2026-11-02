import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Truck } from "lucide-react";
import { nuvemshopProduct, nuvemshopBuyNow } from "@/lib/nuvemshop.functions";
import { brl } from "@/lib/format";
import { useCart } from "@/lib/cart";

type Variant = { id: number; values?: string[]; price: string | null; promotional_price: string | null; stock?: number | null; stock_management?: boolean };
type Product = { id: number; name: string; handle: string; description?: string; images: { src: string; alt?: string }[]; attributes?: string[]; variants: Variant[] };
export const Route = createFileRoute("/produto/$slug")({
  loader: async ({ params }) => {
    const product = await nuvemshopProduct({ data: { handle: params.slug } });
    if (!product) throw notFound();
    return { product: product as Product };
  },
  head: ({ loaderData }) => ({ meta: [{ title: loaderData ? `${loaderData.product.name} — Marcos Joias & Relógios` : "Produto — Marcos Joias & Relógios" }] }),
  component: ProductPage,
});
function ProductPage() {
  const { product } = Route.useLoaderData();
  const { addReal } = useCart();
  const navigate = useNavigate();
  const [imageIndex, setImageIndex] = useState(0);
  const [variantId, setVariantId] = useState<number | null>(null);
  const [qty, setQty] = useState(1);
  const [checkingOut, setCheckingOut] = useState(false);
  // Stock may be omitted by the public API; only hide a variant when zero is explicit.
  const available = product.variants.filter(v => v.stock_management !== true || v.stock !== 0);
  const selected = available.find(v => v.id === variantId) ?? available[0] ?? product.variants[0];
  const regular = selected?.price == null ? null : Number(selected.price);
  const promotional = selected?.promotional_price == null ? null : Number(selected.promotional_price);
  const price = promotional != null && Number.isFinite(promotional) ? promotional : regular;
  const addToCart = () => {
    if (!selected || available.length === 0 || price == null || !Number.isFinite(price)) return;
    addReal({ productId: product.id, variantId: selected.id, handle: product.handle, name: product.name, image: product.images[0]?.src ?? "", price, variantLabel: selected.values?.join(" / ") ?? "", qty });
    toast.success("Produto adicionado ao carrinho");
    navigate({ to: "/carrinho" });
  };
  const checkoutNow = async () => {
    if (!selected) return;
    setCheckingOut(true);
    try {
      const result = await nuvemshopBuyNow({ data: { productId: product.id, variantId: selected.id, quantity: qty } });
      window.location.assign(result.checkoutUrl);
    } catch {
      toast.error("Não foi possível iniciar o pagamento. Tente novamente em instantes.");
      setCheckingOut(false);
    }
  };
  return <div className="mx-auto grid max-w-7xl gap-8 px-0 py-6 md:grid-cols-2 md:gap-14 md:px-8 md:py-12">
    <div>
      <div className="overflow-hidden bg-secondary">
        {product.images[imageIndex] ? <img src={product.images[imageIndex].src} alt={product.images[imageIndex].alt || product.name} className="aspect-[4/5] w-full object-cover" /> : <div className="aspect-[4/5]" />}
      </div>
      {product.images.length > 1 && <div className="mt-2 flex gap-2 overflow-x-auto px-4 md:px-0">{product.images.map((img, i) => <button key={i} type="button" onClick={() => setImageIndex(i)} className={`w-20 shrink-0 overflow-hidden border ${imageIndex === i ? "border-foreground" : "border-transparent opacity-60"}`}><img src={img.src} alt={img.alt || `Foto ${i + 1}`} className="aspect-square w-full object-cover" /></button>)}</div>}
    </div>
    <div className="px-4 md:px-0 md:pt-6">
      <p className="eyebrow text-muted-foreground">Marcos Joias & Relógios</p>
      <h1 className="mt-3 text-3xl leading-tight md:text-4xl">{product.name}</h1>
      <div className="mt-6 flex items-baseline gap-3">
        {price != null && Number.isFinite(price) ? <span className="text-2xl font-semibold">{brl(price)}</span> : <span>Consulte o preço</span>}
        {regular != null && price != null && price < regular && <span className="text-muted-foreground line-through">{brl(regular)}</span>}
      </div>
      {available.length > 1 && <div className="mt-8"><p className="eyebrow mb-3">Escolha a opção</p><div className="flex flex-wrap gap-2">{available.map(v => <button type="button" key={v.id} onClick={() => setVariantId(v.id)} className={`border px-4 py-3 text-sm ${selected?.id === v.id ? "border-foreground bg-foreground text-background" : "hover:border-foreground"}`}>{v.values?.join(" / ") || `Opção ${v.id}`}</button>)}</div></div>}
      <div className="mt-8"><p className="eyebrow mb-3">Quantidade</p><div className="inline-flex h-12 items-center border"><button type="button" className="px-4" onClick={() => setQty(q => Math.max(1,q-1))}>−</button><span className="w-8 text-center text-sm">{qty}</span><button type="button" className="px-4" onClick={() => setQty(q => Math.min(99,q+1))}>+</button></div></div>
      <p className="mt-6 text-sm text-muted-foreground">A finalização do pagamento acontece no ambiente seguro da Nuvemshop.</p>
      {selected && available.length > 0 ? <button type="button" onClick={checkoutNow} disabled={checkingOut} className="btn-solid mt-4 w-full">{checkingOut ? "Abrindo checkout..." : "Comprar agora"}</button> : <p className="mt-4 text-sm text-muted-foreground">Produto indisponível no momento.</p>}
      {selected && available.length > 0 && <button type="button" onClick={addToCart} className="btn-outline mt-3 w-full">Adicionar ao carrinho</button>}
      <div className="mt-8 flex gap-3 bg-secondary p-4 text-sm"><Truck className="h-5 w-5 shrink-0" /><p className="text-muted-foreground">Frete e formas de pagamento calculados na finalização da compra.</p></div>
      {product.description && <div className="mt-10 border-t pt-8"><h2 className="eyebrow mb-3">Descrição</h2><div className="text-sm leading-relaxed text-muted-foreground">{product.description.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ")}</div></div>}
    </div>
  </div>;
}
