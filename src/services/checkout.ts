// Converte o carrinho no formato esperado pelo checkout oficial da Nuvemshop.
// variantId fica vazio enquanto os produtos forem demonstrativos.
import type { Product } from "@/types/catalog";

export type CartLine = { slug: string; variant?: string | undefined; qty: number };
export type CheckoutLine = { slug: string; qty: number; variant?: string | undefined; variantId?: number | undefined };

export function toCheckoutLines(items: CartLine[], find: (slug: string) => Product | undefined): CheckoutLine[] {
  return items.flatMap((i) => {
    const p = find(i.slug);
    if (!p) return [];
    const variantId = i.variant ? p.variants?.externalIds?.[i.variant] : p.defaultVariantId;
    return [{ slug: i.slug, qty: Math.min(99, Math.max(1, i.qty)), ...(i.variant ? { variant: i.variant } : {}), ...(variantId ? { variantId } : {}) }];
  });
}
