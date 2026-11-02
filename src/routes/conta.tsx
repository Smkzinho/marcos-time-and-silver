import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/conta")({
  head: () => ({
    meta: [
      { title: "Minha conta — Marcos Joias & Relógios" },
      { name: "description", content: "Área do cliente." },
      { property: "og:title", content: "Minha conta — Marcos Joias & Relógios" },
      { property: "og:description", content: "Área do cliente." },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-3xl">Minha conta</h1>
      <p className="mt-3 text-sm text-muted-foreground">A área do cliente estará disponível junto com a integração da loja.</p>
      <Link to="/" className="btn-outline mt-8">Voltar à loja</Link>
    </div>
  ),
});
