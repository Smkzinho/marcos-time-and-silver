import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import type { Product } from "@/data/catalog";
import { brl, installmentText } from "@/lib/format";
import { useCart } from "@/lib/cart";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  return (
    <article className="group flex flex-col">
      <Link to="/produto/$slug" params={{ slug: product.slug }} className="relative block overflow-hidden bg-secondary">
        <img src={product.images[0]} alt={product.name} loading="lazy" width={800} height={1008} className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
        {product.badge && (
          <span className={`eyebrow absolute left-3 top-3 px-2.5 py-1 text-[0.6rem] ${product.badge === "Promoção" ? "bg-primary text-primary-foreground" : "bg-background text-foreground"}`}>
            {product.badge}
          </span>
        )}
        <span className="absolute bottom-3 right-3 bg-background/90 px-2 py-0.5 text-[0.6rem] uppercase tracking-widest text-muted-foreground">Exemplo</span>
      </Link>
      <div className="flex flex-1 flex-col pt-4">
        <Link to="/produto/$slug" params={{ slug: product.slug }} className="text-sm leading-snug hover:underline">{product.name}</Link>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-semibold">{brl(product.price)}</span>
          {product.compareAtPrice && <span className="text-xs text-muted-foreground line-through">{brl(product.compareAtPrice)}</span>}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{installmentText(product.price)}</p>
        <button
          className="btn-outline mt-4 h-10 w-full text-[0.65rem]"
          onClick={() => {
            add(product.slug, 1, product.variants?.options[0]);
            toast.success("Adicionado ao carrinho", { description: product.name });
          }}
        >
          Adicionar ao carrinho
        </button>
      </div>
    </article>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 md:gap-x-6">
      {products.map((p) => <ProductCard key={p.slug} product={p} />)}
    </div>
  );
}

export function SectionTitle({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <div className="mb-10 text-center">
      {eyebrow && <p className="eyebrow text-muted-foreground">{eyebrow}</p>}
      <h2 className="mt-3 text-3xl md:text-4xl">{title}</h2>
    </div>
  );
}
