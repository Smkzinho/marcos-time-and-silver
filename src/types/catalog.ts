// Formato interno do catálogo. Os componentes só conhecem estes tipos;
// dados da Nuvemshop são convertidos para eles em src/services/nuvemshop/mappers.ts.

export type Category = {
  slug: string;
  name: string;
  menuName: string;
  image: string;
  /** ID da categoria na Nuvemshop (preenchido após a sincronização). */
  externalId?: number | undefined;
};

export type ProductVariant = {
  label: string;
  options: string[];
  /** Mapa opção -> ID da variante na Nuvemshop (preenchido após a sincronização). */
  externalIds?: Record<string, number> | undefined;
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  price: number;
  compareAtPrice?: number | undefined;
  images: string[];
  badge?: "Lançamento" | "Promoção" | undefined;
  tags: ("mais-vendidos" | "novidades" | "ofertas")[];
  description: string;
  material: string;
  features: string[];
  variants?: ProductVariant | undefined;
  /** Estoque disponível; undefined = não controlado. */
  stock?: number | undefined;
  /** true para produtos de exemplo (exibem a etiqueta "Exemplo"). */
  demo: boolean;
  externalId?: number | undefined;
  /** ID da variante padrão na Nuvemshop, para produtos sem variação. */
  defaultVariantId?: number | undefined;
};

export type Catalog = {
  source: "demo" | "nuvemshop";
  categories: Category[];
  products: Product[];
};
