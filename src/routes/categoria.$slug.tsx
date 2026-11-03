import { createFileRoute, notFound } from "@tanstack/react-router";
import { getCategory, products } from "@/services/catalog";
import { ProductGrid } from "@/components/store/ProductCard";

export const Route = createFileRoute("/categoria/$slug")({
  loader: ({ params }) => {
    const category = getCategory(params.slug);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `${loaderData.category.name} — Marcos Joias & Relógios` : "Categoria — Marcos Joias & Relógios";
    const d = loaderData ? `Conheça a seleção de ${loaderData.category.name.toLowerCase()} da Marcos Joias & Relógios.` : "";
    return { meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }] };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const list = products.filter((p) => p.category === category.slug);
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
      <p className="eyebrow text-muted-foreground">Categoria</p>
      <h1 className="mt-3 text-4xl md:text-5xl">{category.name}</h1>
      <p className="mt-3 text-sm text-muted-foreground">{list.length} produto(s) demonstrativo(s)</p>
      <div className="mt-12">
        {list.length ? <ProductGrid products={list} /> : <p className="text-muted-foreground">Nenhum produto nesta categoria ainda.</p>}
      </div>
    </div>
  );
}
