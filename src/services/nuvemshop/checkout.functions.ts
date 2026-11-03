// Encaminhamento ao checkout oficial da Nuvemshop.
// O fluxo real (criação do carrinho/pedido e URL de pagamento) ainda NÃO foi
// implementado: a função sempre retorna checkoutUrl: null e o site avisa
// que o checkout está em preparação. Nenhuma integração é simulada.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const input = z.object({
  items: z
    .array(z.object({ slug: z.string().max(120), qty: z.number().int().min(1).max(99), variant: z.string().max(80).optional(), variantId: z.number().int().optional() }))
    .min(1)
    .max(50),
  coupon: z.string().max(40).optional(),
});

export const startNuvemshopCheckout = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => input.parse(d))
  .handler(async () => {
    const { nuvemshopCredentials } = await import("./client.server");
    const configured = !!nuvemshopCredentials();
    // TODO(integração): com credenciais e variantId de todos os itens,
    // criar o checkout na Nuvemshop e retornar a URL oficial.
    return { configured, checkoutUrl: null as string | null };
  });
