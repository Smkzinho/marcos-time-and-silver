import { store } from "@/config/store";

export const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function installmentText(price: number) {
  const { max, minValue } = store.installments;
  const n = Math.max(1, Math.min(max, Math.floor(price / minValue)));
  return n > 1 ? `ou ${n}x de ${brl(price / n)} sem juros` : "";
}
