// Integração com a Storefront API pública (não com a Admin API).
// Loja pública 8107797 configurada; NUVEMSHOP_STORE_ID pode substituir esse valor. Não é necessário token
// OAuth para ler o catálogo público de uma loja habilitada.
// Documentação: https://nuvemshop.dev/en-US/storefront-api/getting-started
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const API = "https://storefront-api.tiendanube.com";
const VERSION = "2026-11";

function storeId() {
  const value = process.env["NUVEMSHOP_STORE_ID"]?.trim() || "8107797";
  if (!value || !/^\d+$/.test(value)) return null;
  return value;
}

async function storefrontGet(resource: "products" | "categories") {
  const id = storeId();
  if (!id) return { configured: false as const, data: null };
  const fields = resource === "products"
    ? "?fields=id,name,handle,images,variants,categories,description"
    : "";
  const response = await fetch(
    `${API}/${VERSION}/stores/${id}/${resource}${fields}`,
    { headers: { Accept: "application/json" }, cache: "no-store" },
  );
  if (!response.ok) {
    // Falhar explicitamente é mais seguro que mostrar produtos fictícios como reais.
    throw new Error(`Erro na Storefront API (${resource}): HTTP ${response.status}`);
  }
  // A Storefront API retorna { data: [...], pagination: {...} }.
  return { configured: true as const, data: await response.json() };
}

export const nuvemshopProducts = createServerFn({ method: "GET" }).handler(
  () => storefrontGet("products"),
);
export const nuvemshopCategories = createServerFn({ method: "GET" }).handler(
  () => storefrontGet("categories"),
);


export const nuvemshopProduct = createServerFn({ method: "GET" })
  .inputValidator(z.object({ handle: z.string().min(1).max(200) }))
  .handler(async ({ data }) => {
    const id = storeId();
    if (!id) return null;
    const response = await fetch(
      `${API}/${VERSION}/stores/${id}/products/${encodeURIComponent(data.handle)}?fields=id,name,handle,description,images,variants,attributes,categories`,
      { headers: { Accept: "application/json" }, cache: "no-store" },
    );
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`Erro ao carregar produto: HTTP ${response.status}`);
    return response.json();
  });

// Ainda não está ligado ao botão de comprar. O carrinho local hoje usa slugs
// demonstrativos; a API exige os IDs reais de product_id e variant_id.
// Não iniciar checkout até que o catálogo e a seleção de variantes sejam migrados.
export const nuvemshopCheckout = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      items: z.array(z.object({
        slug: z.string(),
        variant: z.string().optional(),
        qty: z.number().int().min(1).max(99),
      })).max(50),
      coupon: z.string().max(40).optional(),
    }),
  )
  .handler(async () => {
    return { configured: false as const, checkoutUrl: null };
  });

/** Experimental one-item checkout using the documented Storefront cart API.
 * Keep shopper-facing payments on Nuvemshop's hosted checkout.
 */
export const nuvemshopBuyNow = createServerFn({ method: "POST" })
  .inputValidator(z.object({
    productId: z.number().int().positive(),
    variantId: z.number().int().positive(),
    quantity: z.number().int().min(1).max(99),
  }))
  .handler(async ({ data }) => {
    const id = storeId();
    if (!id) throw new Error("Loja não configurada");
    const base = `${API}/unstable/stores/${id}/carts`;
    async function send(url: string, body?: unknown) {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`Carrinho Nuvemshop: HTTP ${res.status}`);
      return res.json();
    }
    const created = await send(base);
    if (typeof created?.id !== "string") throw new Error("Resposta de carrinho inválida");
    const cartId = encodeURIComponent(created.id);
    await send(`${base}/${cartId}/line-items`, {
      product_id: data.productId,
      variant_id: data.variantId,
      quantity: data.quantity,
    });
    const checkout = await send(`${base}/${cartId}/checkout`);
    const url = checkout?.checkout_url;
    if (typeof url !== "string" || !url.startsWith("https://")) throw new Error("URL de checkout inválida");
    return { checkoutUrl: url };
  });

/** Multi-item checkout. Prices are revalidated by Nuvemshop, not trusted from the browser. */
export const nuvemshopCartCheckout = createServerFn({ method: "POST" })
  .inputValidator(z.object({ items: z.array(z.object({
    productId: z.number().int().positive(),
    variantId: z.number().int().positive(),
    quantity: z.number().int().min(1).max(99),
  })).min(1).max(30) }))
  .handler(async ({ data }) => {
    const id = storeId();
    if (!id) throw new Error("Loja não configurada");
    const base = `${API}/unstable/stores/${id}/carts`;
    async function post(url: string, body?: unknown) {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
        cache: "no-store",
      });
      if (!response.ok) throw new Error(`Carrinho Nuvemshop: HTTP ${response.status}`);
      return response.json();
    }
    const cart = await post(base);
    if (typeof cart?.id !== "string") throw new Error("ID de carrinho inválido");
    const cartId = encodeURIComponent(cart.id);
    for (const item of data.items) {
      await post(`${base}/${cartId}/line-items`, {
        product_id: item.productId,
        variant_id: item.variantId,
        quantity: item.quantity,
      });
    }
    const result = await post(`${base}/${cartId}/checkout`);
    if (typeof result?.checkout_url !== "string" || !result.checkout_url.startsWith("https://"))
      throw new Error("Checkout não retornou uma URL válida");
    return { checkoutUrl: result.checkout_url as string };
  });
