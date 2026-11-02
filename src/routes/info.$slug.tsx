import { createFileRoute, notFound } from "@tanstack/react-router";
import { policies } from "@/config/store";

export const Route = createFileRoute("/info/$slug")({
  loader: ({ params }) => {
    const page = policies[params.slug];
    if (!page) throw notFound();
    return { page };
  },
  head: ({ loaderData }) => {
    const t = `${loaderData?.page.title ?? "Informações"} — Marcos Joias & Relógios`;
    return { meta: [{ title: t }, { name: "description", content: t }, { property: "og:title", content: t }, { property: "og:description", content: t }] };
  },
  component: InfoPage,
});

function InfoPage() {
  const { page } = Route.useLoaderData();
  return (
    <div className="mx-auto max-w-2xl px-4 py-20">
      <h1 className="text-4xl">{page.title}</h1>
      <p className="mt-6 leading-relaxed text-muted-foreground">{page.body}</p>
    </div>
  );
}
