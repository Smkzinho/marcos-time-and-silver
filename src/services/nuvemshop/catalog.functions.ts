// Busca o catálogo real na Nuvemshop. Sem credenciais, retorna configured: false
// e o site continua com o catálogo demonstrativo (src/services/catalog.ts).
// AINDA NÃO LIGADO às páginas — ativar somente após teste com a loja real.
import { createServerFn } from "@tanstack/react-start";
import type { Catalog } from "@/types/catalog";

export const fetchNuvemshopCatalog = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ configured: false } | { configured: true; catalog: Catalog }> => {
    const { nuvemshopCredentials, nuvemshopRequest } = await import("./client.server");
    if (!nuvemshopCredentials()) return { configured: false };
    const { mapCategory, mapProduct } = await import("./mappers");
    const [nsCats, nsProducts] = await Promise.all([
      nuvemshopRequest<import("./mappers").NsCategory[]>("/categories"),
      nuvemshopRequest<import("./mappers").NsProduct[]>("/products?published=true&per_page=200"),
    ]);
    const categories = nsCats.map(mapCategory);
    const products = nsProducts.map((p) => mapProduct(p, categories));
    return { configured: true, catalog: { source: "nuvemshop", categories, products } };
  },
);
