import { brl } from "@/lib/format";

export type LiveProduct = {
  id: number;
  name: string;
  handle: string;
  images: { src: string; alt?: string }[];
  variants: { id: number; price: string | null; promotional_price: string | null; stock: number | null; stock_management: boolean }[];
};

function currentPrice(product: LiveProduct) {
  const variant = product.variants.find((v) => !v.stock_management || (v.stock ?? 0) > 0) ?? product.variants[0];
  if (!variant) return null;
  const regular = Number(variant.price);
  const promotional = variant.promotional_price ? Number(variant.promotional_price) : null;
  if (!Number.isFinite(regular)) return null;
  return { regular, amount: promotional != null && Number.isFinite(promotional) ? promotional : regular };
}

// Until the headless cart is implemented, open the existing Nuvemshop product
// page. Customers can purchase through the already configured native checkout.
export function LiveProductGrid({ products }: { products: LiveProduct[] }) {
  if (!products.length) return <p className="text-center text-muted-foreground">Nenhum produto disponível nesta vitrine.</p>;
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 md:gap-x-6">
      {products.map((p) => {
        const price = currentPrice(p);
        const href = `https://marcosjoiasbv.com.br/produtos/${encodeURIComponent(p.handle)}/`;
        return <article className="group flex flex-col" key={p.id}>
          <a className="relative block overflow-hidden bg-secondary" href={href}>
            {p.images[0] ? <img src={p.images[0].src} alt={p.images[0].alt || p.name} loading="lazy" className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" /> : <div className="aspect-[4/5] bg-secondary" />}
          </a>
          <div className="flex flex-1 flex-col pt-4">
            <a href={href} className="text-sm leading-snug hover:underline">{p.name}</a>
            {price ? <div className="mt-2 flex items-baseline gap-2">
              <span className="font-semibold">{brl(price.amount)}</span>
              {price.amount < price.regular && <span className="text-xs text-muted-foreground line-through">{brl(price.regular)}</span>}
            </div> : <p className="mt-2 text-sm text-muted-foreground">Consulte o preço</p>}
            <a href={href} className="btn-outline mt-4 flex h-10 w-full items-center justify-center text-[0.65rem]">Ver produto</a>
          </div>
        </article>;
      })}
    </div>
  );
}
