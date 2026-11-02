import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getProduct } from "@/data/catalog";

export type CartItem = { slug: string; variant?: string | undefined; qty: number };
const KEY = "mjr-cart-v1";
const keyOf = (i: { slug: string; variant?: string | undefined }) => `${i.slug}::${i.variant ?? ""}`;

type Ctx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (slug: string, qty?: number, variant?: string) => void;
  setQty: (slug: string, variant: string | undefined, qty: number) => void;
  remove: (slug: string, variant?: string) => void;
  clear: () => void;
};

const CartContext = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, ready]);

  const value = useMemo<Ctx>(() => {
    const valid = items.filter((i) => getProduct(i.slug));
    return {
      items: valid,
      count: valid.reduce((s, i) => s + i.qty, 0),
      subtotal: valid.reduce((s, i) => s + i.qty * (getProduct(i.slug)?.price ?? 0), 0),
      add: (slug, qty = 1, variant) =>
        setItems((prev) => {
          const k = keyOf({ slug, variant });
          const found = prev.find((i) => keyOf(i) === k);
          return found
            ? prev.map((i) => (keyOf(i) === k ? { ...i, qty: i.qty + qty } : i))
            : [...prev, { slug, variant, qty }];
        }),
      setQty: (slug, variant, qty) =>
        setItems((prev) =>
          prev
            .map((i) => (keyOf(i) === keyOf({ slug, variant }) ? { ...i, qty } : i))
            .filter((i) => i.qty > 0),
        ),
      remove: (slug, variant) =>
        setItems((prev) => prev.filter((i) => keyOf(i) !== keyOf({ slug, variant }))),
      clear: () => setItems([]),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
