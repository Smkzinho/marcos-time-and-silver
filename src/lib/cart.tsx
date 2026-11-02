import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getProduct } from "@/data/catalog";

export type CartItem = { slug: string; variant?: string | undefined; qty: number }; 
export type RealCartItem = { productId: number; variantId: number; handle: string; name: string; image: string; price: number; variantLabel: string; qty: number }; 
const REAL_KEY = "mjr-real-cart-v1";
const KEY = "mjr-cart-v1";
const keyOf = (i: { slug: string; variant?: string | undefined }) => `${i.slug}::${i.variant ?? ""}`;

type Ctx = {
  items: CartItem[];
  realItems: RealCartItem[];
  addReal: (item: RealCartItem) => void;
  setRealQty: (variantId: number, qty: number) => void;
  removeReal: (variantId: number) => void;
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
  const [realItems, setRealItems] = useState<RealCartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
      const real = localStorage.getItem(REAL_KEY);
      if (real) { const parsed: unknown = JSON.parse(real); if (Array.isArray(parsed)) setRealItems(parsed.filter((x): x is RealCartItem => x != null && typeof x.variantId === "number" && typeof x.price === "number" && typeof x.qty === "number" && typeof x.name === "string")); }
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, ready]);

  useEffect(() => { if (ready) localStorage.setItem(REAL_KEY, JSON.stringify(realItems)); }, [realItems, ready]);

  const value = useMemo<Ctx>(() => {
    const valid = items.filter((i) => getProduct(i.slug));
    return {
      items: valid,
      realItems,
      addReal: (item) => setRealItems(prev => { const found = prev.find(i => i.variantId === item.variantId); return found ? prev.map(i => i.variantId === item.variantId ? { ...item, qty: Math.min(99, i.qty + item.qty) } : i) : [...prev, item]; }),
      setRealQty: (variantId, qty) => setRealItems(prev => prev.map(i => i.variantId === variantId ? { ...i, qty: Math.min(99, qty) } : i).filter(i => i.qty > 0)),
      removeReal: (variantId) => setRealItems(prev => prev.filter(i => i.variantId !== variantId)),
      count: realItems.reduce((s, i) => s + i.qty, 0),
      subtotal: realItems.reduce((s, i) => s + i.qty * i.price, 0),
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
      clear: () => { setItems([]); setRealItems([]); },
    };
  }, [items, realItems]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
