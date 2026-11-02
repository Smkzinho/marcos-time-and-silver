import { createFileRoute, notFound } from "@tanstack/react-router";
import { getCategory } from "@/data/catalog";
import { nuvemshopProducts } from "@/lib/nuvemshop.functions";
import { LiveProductGrid, type LiveProduct } from "@/components/store/LiveProductGrid";
export const Route = createFileRoute("/categoria/$slug")({
  loader: async ({ params }) => {
    const category = getCategory(params.slug);
    if (!category) throw notFound();
    const result = await nuvemshopProducts();
    const products = (result.data?.data ?? []) as LiveProduct[];
    const tokens: Record<string, string[]> = {
      "relogios": ["relogio", "relógio"],
      "smartwatches": ["smartwatch"],
      "prata-925": ["prata 925", "prata"],
      "aco-inoxidavel": ["aço", "aco"],
      "banhados-ouro-18k": ["banhado", "ouro"],
    };
    const list = products.filter(p => (tokens[category.slug] ?? []).some(token => p.name.toLocaleLowerCase("pt-BR").includes(token)));
    return { category, list };
  },
  component: CategoryPage,
});
function CategoryPage() {
  const { category, list } = Route.useLoaderData();
  return <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20"><p className="eyebrow text-muted-foreground">Categoria</p><h1 className="mt-3 text-4xl md:text-5xl">{category.name}</h1><p className="mt-3 text-sm text-muted-foreground">{list.length} produto(s)</p><div className="mt-12"><LiveProductGrid products={list} /></div></div>;
}
