import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { z } from "zod";
import { nuvemshopProducts } from "@/lib/nuvemshop.functions";
import { LiveProductGrid, type LiveProduct } from "@/components/store/LiveProductGrid";
export const Route = createFileRoute("/busca")({
  validateSearch: z.object({ q: z.string().max(80).optional() }),
  loader: async () => {
    const result = await nuvemshopProducts();
    return { products: (result.data?.data ?? []) as LiveProduct[] };
  },
  component: SearchPage,
});
const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
function SearchPage() {
  const { q = "" } = Route.useSearch();
  const { products } = Route.useLoaderData();
  const navigate = useNavigate({ from: "/busca" });
  const results = q ? products.filter(p => norm(p.name).includes(norm(q))) : [];
  return <div className="mx-auto max-w-7xl px-4 py-14 md:px-8"><div className="mx-auto flex max-w-xl items-center border-b border-foreground"><Search className="h-5 w-5" strokeWidth={1.5}/><input autoFocus defaultValue={q} onChange={e => navigate({search:{q:e.target.value || undefined},replace:true})} placeholder="O que você procura?" className="h-14 flex-1 bg-transparent px-3 font-display text-xl outline-none"/></div><div className="mt-12">{q && !results.length && <p className="text-center text-muted-foreground">Nenhum produto encontrado.</p>}<LiveProductGrid products={results}/></div></div>;
}
