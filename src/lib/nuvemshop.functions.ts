// Camada de integração com a API da Nuvemshop (PREPARADA, NÃO ATIVA).
// As credenciais ficam apenas no servidor: NUVEMSHOP_STORE_ID e NUVEMSHOP_ACCESS_TOKEN.
// Enquanto não estiverem configuradas, as funções retornam { configured: false }
// e o site continua usando o catálogo demonstrativo em src/data/catalog.ts.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const API = "https://api.nuvemshop.com.br/v1";

function creds() {
  const storeId = process.env['NUVEMSHOP_STORE_ID'];
  const token = process.env['NUVEMSHOP_ACCESS_TOKEN'];
  return storeId && token ? { storeId, token } : null;
}

async function call(path: string, init?: RequestInit) {
  const c = creds();
  if (!c) return { configured: false as const, data: null };
  const res = await fetch(`${API}/${c.storeId}${path}`, {
    ...init,
    headers: {
      Authentication: `bearer ${c.token}`,
      "User-Agent": "Marcos Joias & Relogios",
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!res.ok) throw new Error(`Nuvemshop ${res.status}`);
  return { configured: true as const, data: await res.json() };
}

export const nuvemshopProducts = createServerFn({ method: "GET" }).handler(() => call("/products"));
export const nuvemshopCategories = createServerFn({ method: "GET" }).handler(() => call("/categories"));

// Checkout: a ser implementado com o fluxo oficial da Nuvemshop.
// Recebe os itens do carrinho e deverá retornar a URL de checkout.
export const nuvemshopCheckout = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      items: z.array(z.object({ slug: z.string(), variant: z.string().optional(), qty: z.number().int().min(1).max(99) })).max(50),
      coupon: z.string().max(40).optional(),
    }),
  )
  .handler(async () => {
    if (!creds()) return { configured: false as const, checkoutUrl: null };
    return { configured: false as const, checkoutUrl: null };
  });
