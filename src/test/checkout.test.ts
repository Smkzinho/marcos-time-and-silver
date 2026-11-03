import { describe, expect, it } from "vitest";
import { toCheckoutLines } from "@/services/checkout";
import { getProduct } from "@/services/catalog";
import type { Product } from "@/types/catalog";

describe("encaminhamento ao checkout", () => {
  it("ignora produtos que não existem no catálogo", () => {
    expect(toCheckoutLines([{ slug: "inexistente", qty: 1 }], getProduct)).toEqual([]);
  });
  it("envia o código da variação escolhida", () => {
    const p = { slug: "x", variants: { label: "Aro", options: ["16"], externalIds: { "16": 555 } } } as unknown as Product;
    expect(toCheckoutLines([{ slug: "x", variant: "16", qty: 2 }], () => p)[0]?.variantId).toBe(555);
  });
  it("limita a quantidade a 99", () => {
    expect(toCheckoutLines([{ slug: "cronografo-branco", qty: 500 }], getProduct)[0]?.qty).toBe(99);
  });
});
