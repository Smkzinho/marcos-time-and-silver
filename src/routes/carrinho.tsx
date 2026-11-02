import { createFileRoute, Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
export const Route = createFileRoute("/carrinho")({ component: CartPage });
function CartPage() {
  return <div className="mx-auto max-w-xl px-4 py-24 text-center">
    <ShoppingBag className="mx-auto h-9 w-9" strokeWidth={1.4} />
    <h1 className="mt-6 text-3xl">Seu carrinho</h1>
    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Estamos conectando o carrinho ao checkout oficial da Nuvemshop. Por enquanto, abra uma peça da coleção e use “Comprar na loja oficial” para finalizar sua compra com segurança.</p>
    <Link to="/" className="btn-solid mt-8">Explorar produtos</Link>
  </div>;
}
