import { createFileRoute, Link } from "@tanstack/react-router";
import { Instagram } from "lucide-react";
import { store } from "@/config/store";
import { categories } from "@/data/catalog";
import { nuvemshopProducts } from "@/lib/nuvemshop.functions";
import { LiveProductGrid, type LiveProduct } from "@/components/store/LiveProductGrid";
import { SectionTitle } from "@/components/store/ProductCard";
import prata from "@/assets/cat-prata.jpg";
import aco from "@/assets/cat-aco.jpg";
import crono from "@/assets/prod-cronografo.jpg";
import brincos from "@/assets/prod-brincos.jpg";
import smart from "@/assets/cat-smartwatch.jpg";
import ouro from "@/assets/cat-ouro.jpg";

export const Route = createFileRoute("/")({
  loader: async () => {
    try {
      const response = await nuvemshopProducts();
      return { liveProducts: (response.data?.data ?? []) as LiveProduct[], error: false };
    } catch {
      return { liveProducts: [] as LiveProduct[], error: true };
    }
  },
  head: () => ({
    meta: [
      { title: "Marcos Joias & Relógios — Estilo que marca presença" },
      { name: "description", content: "Relógios, smartwatches e joias em prata 925, aço inoxidável e banhados a ouro 18k." },
      { property: "og:title", content: "Marcos Joias & Relógios" },
      { property: "og:description", content: "Peças selecionadas para quem valoriza cada detalhe." },
    ],
  }),
  component: Index,
});

// Fotos do Instagram: substitua por imagens oficiais da marca.
const instaPhotos = [crono, prata, smart, aco, brincos, ouro];

function Index() {
  const { hero } = store;
  const { liveProducts, error } = Route.useLoaderData();
  return (
    <>
      <section className="relative h-[86svh] min-h-[520px] overflow-hidden bg-primary">
        <img src={hero.image} alt="Relógio e corrente em fotografia editorial preto e branco" width={1600} height={1008} className="absolute inset-0 h-full w-full object-cover object-[70%_center]" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent md:bg-gradient-to-r md:from-primary/80 md:via-primary/20" />
        <div className="relative mx-auto flex h-full max-w-7xl items-end px-4 pb-16 md:items-center md:px-8 md:pb-0">
          <div className="max-w-xl animate-fade-up text-primary-foreground">
            <p className="eyebrow text-muted-foreground">{store.name}</p>
            <h1 className="mt-5 text-4xl leading-[1.05] md:text-6xl lg:text-7xl">{hero.title}</h1>
            <p className="mt-5 max-w-md text-base text-primary-foreground/75 md:text-lg">{hero.subtitle}</p>
            <a href="#colecao" className="btn-light mt-9">{hero.cta}</a>
          </div>
        </div>
      </section>

      <section id="colecao" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 md:px-8 md:py-28">
        <SectionTitle eyebrow="Categorias" title="Explore a coleção" />
        <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-5 md:gap-4 md:overflow-visible md:px-0">
          {categories.map((c) => (
            <Link key={c.slug} to="/categoria/$slug" params={{ slug: c.slug }} className="group relative block w-[62%] shrink-0 snap-start overflow-hidden bg-secondary md:w-auto">
              <img src={c.image} alt={c.name} loading="lazy" width={800} height={1008} className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/80 to-transparent p-4 pt-16 text-primary-foreground">
                <h3 className="text-lg leading-tight">{c.name}</h3>
                <span className="eyebrow mt-2 inline-block text-[0.6rem] text-primary-foreground/70 group-hover:text-primary-foreground">Ver produtos →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
        <SectionTitle eyebrow="Catálogo oficial" title="Conheça nossas peças" />
        {error && <p role="alert" className="mb-6 text-center text-sm text-muted-foreground">Não foi possível carregar o catálogo agora.</p>}
        <LiveProductGrid products={liveProducts} />
      </section>

      <section className="bg-primary py-20 text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:grid-cols-2 md:px-8 lg:grid-cols-4">
          {store.highlights.map((h, i) => (
            <div key={h.title} className="border-t border-primary-foreground/20 pt-6">
              <span className="font-display text-sm text-muted-foreground">0{i + 1}</span>
              <h3 className="mt-3 text-xl">{h.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{h.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl">ACOMPANHE NOSSA MARCA</h2>
          <p className="mt-3 text-sm text-muted-foreground">Novidades, lançamentos e inspirações para o seu estilo.</p>
        </div>
        <div className="grid grid-cols-3 gap-1 md:grid-cols-6 md:gap-2">
          {instaPhotos.map((src, i) => (
            <div key={i} className="group relative overflow-hidden bg-secondary">
              <img src={src} alt="" loading="lazy" className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          {store.instagram.url ? (
            <a href={store.instagram.url} target="_blank" rel="noreferrer" className="btn-outline"><Instagram className="h-4 w-4" /> {store.instagram.handle}</a>
          ) : (
            <span className="btn-outline pointer-events-none opacity-60"><Instagram className="h-4 w-4" /> Perfil oficial a configurar</span>
          )}
        </div>
      </section>
    </>
  );
}
