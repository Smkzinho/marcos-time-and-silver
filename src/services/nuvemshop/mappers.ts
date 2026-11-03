// Conversão dos dados da API da Nuvemshop para os tipos internos do site.
// Formatos baseados na documentação pública (Products / Categories). Revisar ao ativar.
import type { Category, Product } from "@/types/catalog";

type I18n = Record<string, string | undefined>;
const pt = (v?: I18n) => v?.["pt"] ?? Object.values(v ?? {})[0] ?? "";

export type NsCategory = { id: number; name: I18n; handle: I18n };
export type NsVariant = { id: number; price: string; promotional_price: string | null; stock: number | null; values: I18n[] };
export type NsProduct = {
  id: number; name: I18n; handle: I18n; description: I18n; published: boolean;
  categories: { id: number }[]; images: { src: string }[]; variants: NsVariant[];
  attributes: I18n[]; tags?: string;
};

export function mapCategory(c: NsCategory): Category {
  const name = pt(c.name);
  return { slug: pt(c.handle), name, menuName: name, image: "", externalId: c.id };
}

export function mapProduct(p: NsProduct, cats: Category[]): Product {
  const v0 = p.variants[0];
  const promo = v0?.promotional_price ? Number(v0.promotional_price) : undefined;
  const base = Number(v0?.price ?? 0);
  const label = p.attributes[0] ? pt(p.attributes[0]) : "";
  const hasVariants = p.variants.length > 1 && label;
  const stocks = p.variants.map((v) => v.stock);
  return {
    demo: false,
    externalId: p.id,
    slug: pt(p.handle),
    name: pt(p.name),
    category: cats.find((c) => c.externalId === p.categories[0]?.id)?.slug ?? "",
    price: promo ?? base,
    compareAtPrice: promo ? base : undefined,
    images: p.images.map((i) => i.src),
    tags: [],
    description: pt(p.description).replace(/<[^>]+>/g, ""),
    material: "",
    features: [],
    stock: stocks.some((s) => s === null) ? undefined : stocks.reduce<number>((a, s) => a + (s ?? 0), 0),
    defaultVariantId: hasVariants ? undefined : v0?.id,
    variants: hasVariants
      ? {
          label,
          options: p.variants.map((v) => pt(v.values[0])),
          externalIds: Object.fromEntries(p.variants.map((v) => [pt(v.values[0]), v.id])),
        }
      : undefined,
  };
}
