// Ponto único de acesso ao catálogo usado por páginas e componentes.
// Hoje entrega o catálogo demonstrativo (src/data). Quando a Nuvemshop estiver
// configurada, os dados virão de fetchNuvemshopCatalog (src/services/nuvemshop),
// já convertidos para os mesmos tipos de src/types/catalog.ts.
import type { Catalog, Product } from "@/types/catalog";
import { demoCategories } from "@/data/categories";
import { demoProducts } from "@/data/products";

export type { Category, Product } from "@/types/catalog";

export const demoCatalog: Catalog = { source: "demo", categories: demoCategories, products: demoProducts };

export const categories = demoCatalog.categories;
export const products = demoCatalog.products;

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const byTag = (tag: Product["tags"][number]) => products.filter((p) => p.tags.includes(tag));
