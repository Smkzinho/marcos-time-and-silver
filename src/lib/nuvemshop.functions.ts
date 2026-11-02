// Integração com a Storefront API pública (não com a Admin API).
// Configure NUVEMSHOP_STORE_ID no ambiente do servidor. Não é necessário token
// OAuth para ler o catálogo público de uma loja habilitada.
// Documentação: https://nuvemshop.dev/en-US/storefront-api/getting-started
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const API = "https://storefront-api.tiendanube.com";
const VERSION = "2026-11";

function storeId() {
  const value = process.env["NUVEMSHOP_STORE_ID"]?.trim();
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
