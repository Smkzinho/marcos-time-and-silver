import { createFileRoute, notFound, useNavigate, Link } from "@tanstack/react-router";
import { Minus, Plus, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getCategory, getProduct, products } from "@/data/catalog";
import { brl, installmentText } from "@/lib/format";
import { useCart } from "@/lib/cart";
import { ProductGrid, SectionTitle } from "@/components/store/ProductCard";

export const Route = createFileRoute("/produto/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `${loaderData.product.name} — Marcos Joias & Relógios` : "Produto — Marcos Joias & Relógios";
    const d = loaderData ? `${loaderData.product.name}. ${loaderData.product.material}.` : "";
    return { meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "product" }] };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { add } = useCart();
  const navigate = useNavigate();
  const [img, setImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [variant, setVariant] = useState(product.variants?.options[0]);
  const category = getCategory(product.category);
  const related = products.filter((p) => p.slug !== product.slug && p.category === product.category).concat(products.filter((p) => p.category !== product.category)).slice(0, 4);

  const addToCart = () => {
    add(product.slug, qty, variant);
    toast.success("Adicionado ao carrinho", { description: product.name });
  };

  return (
    <div key={product.slug}>
      <div className="mx-auto grid max-w-7xl gap-8 px-0 md:grid-cols-2 md:gap-14 md:px-8 md:py-12">
        <div>
          <div className="overflow-hidden bg-secondary">
            <img src={product.images[img]} alt={product.name} width={800} height={1008} className="aspect-[4/5] w-full object-cover animate-in fade-in duration-500" key={img} />
          </div>
          {product.images.length > 1 && (
            <div className="mt-2 flex gap-2 px-4 md:px-0">
              {product.images.map((src, i) => (
                <button key={i} onClick={() => setImg(i)} aria-label={`Imagem ${i + 1}`} className={`w-20 overflow-hidden border ${i === img ? "border-foreground" : "border-transparent opacity-60"}`}>
                  <img src={src} alt="" className="aspect-square w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 md:px-0 md:pt-6">
          {category && <Link to="/categoria/$slug" params={{ slug: category.slug }} className="eyebrow text-muted-foreground hover:text-foreground">{category.name}</Link>}
          <h1 className="mt-3 text-3xl leading-tight md:text-4xl">{product.name}</h1>
          <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">Produto demonstrativo</p>
          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-2xl font-semibold">{brl(product.price)}</span>
            {product.compareAtPrice && <span className="text-muted-foreground line-through">{brl(product.compareAtPrice)}</span>}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{installmentText(product.price)}</p>

          {product.variants && (
            <div className="mt-8">
              <p className="eyebrow mb-3">{product.variants.label}: <span className="text-muted-foreground">{variant}</span></p>
              <div className="flex flex-wrap gap-2">
                {product.variants.options.map((o) => (
                  <button key={o} onClick={() => setVariant(o)} className={`h-10 min-w-12 border px-4 text-sm transition-colors ${o === variant ? "border-foreground bg-foreground text-background" : "hover:border-foreground"}`}>{o}</button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8">
            <p className="eyebrow mb-3">Quantidade</p>
            <div className="inline-flex h-12 items-center border">
              <button aria-label="Diminuir" className="px-4" onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus className="h-4 w-4" /></button>
              <span className="w-8 text-center text-sm">{qty}</span>
              <button aria-label="Aumentar" className="px-4" onClick={() => setQty((q) => Math.min(99, q + 1))}><Plus className="h-4 w-4" /></button>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <button className="btn-solid w-full" onClick={() => { add(product.slug, qty, variant); navigate({ to: "/carrinho" }); }}>Comprar</button>
            <button className="btn-outline w-full" onClick={addToCart}>Adicionar ao carrinho</button>
          </div>

          <div className="mt-8 flex gap-3 bg-secondary p-4 text-sm">
            <Truck className="h-5 w-5 shrink-0" strokeWidth={1.5} />
            <p className="text-muted-foreground">Opções e prazos de entrega serão calculados na finalização da compra, conforme o seu CEP.</p>
          </div>

          <div className="mt-10 space-y-8 border-t pt-8">
            <div>
              <h2 className="eyebrow mb-3 font-sans">Descrição</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>
            </div>
            <div>
              <h2 className="eyebrow mb-3 font-sans">Material e características</h2>
              <p className="text-sm text-muted-foreground">{product.material}</p>
              <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                {product.features.map((f) => <li key={f}>{f}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <SectionTitle title="Você também pode gostar" />
        <ProductGrid products={related} />
      </section>
    </div>
  );
}
