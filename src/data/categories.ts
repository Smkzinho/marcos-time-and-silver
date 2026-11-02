import type { Category } from "@/types/catalog";
import { images } from "./images";

// Categorias exibidas no menu, na home e no rodapé (nesta ordem).
export const demoCategories: Category[] = [
  { slug: "relogios", name: "Relógios analógicos", menuName: "Relógios", image: images.relogios },
  { slug: "smartwatches", name: "Smartwatches", menuName: "Smartwatches", image: images.smartwatch },
  { slug: "prata-925", name: "Prata 925", menuName: "Prata 925", image: images.prata },
  { slug: "aco-inoxidavel", name: "Aço inoxidável", menuName: "Aço inoxidável", image: images.aco },
  { slug: "banhados-ouro-18k", name: "Banhados a ouro 18k", menuName: "Banhados a ouro 18k", image: images.ouro },
];
