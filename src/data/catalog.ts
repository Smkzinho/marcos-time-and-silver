// Catálogo DEMONSTRATIVO. Todos os produtos abaixo são exemplos para layout.
// No futuro, estes dados serão substituídos pela sincronização com a Nuvemshop
// (ver src/lib/nuvemshop.functions.ts), mantendo o mesmo formato.
import relogios from "@/assets/cat-relogios.jpg";
import smart from "@/assets/cat-smartwatch.jpg";
import prata from "@/assets/cat-prata.jpg";
import aco from "@/assets/cat-aco.jpg";
import ouro from "@/assets/cat-ouro.jpg";
import crono from "@/assets/prod-cronografo.jpg";
import brincos from "@/assets/prod-brincos.jpg";
import hero from "@/assets/hero.jpg";

export type Category = { slug: string; name: string; menuName: string; image: string };

export type Product = {
  slug: string;
  name: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  badge?: "Lançamento" | "Promoção";
  tags: ("mais-vendidos" | "novidades" | "ofertas")[];
  description: string;
  material: string;
  features: string[];
  variants?: { label: string; options: string[] };
};

export const categories: Category[] = [
  { slug: "relogios", name: "Relógios analógicos", menuName: "Relógios", image: relogios },
  { slug: "smartwatches", name: "Smartwatches", menuName: "Smartwatches", image: smart },
  { slug: "prata-925", name: "Prata 925", menuName: "Prata 925", image: prata },
  { slug: "aco-inoxidavel", name: "Aço inoxidável", menuName: "Aço inoxidável", image: aco },
  { slug: "banhados-ouro-18k", name: "Banhados a ouro 18k", menuName: "Banhados a ouro 18k", image: ouro },
];

const desc = "Produto demonstrativo utilizado para apresentação do layout. Descrição, medidas e informações comerciais reais serão adicionadas a partir do catálogo oficial.";

export const products: Product[] = [
  { slug: "relogio-classico-preto", name: "Relógio Clássico Mostrador Preto", category: "relogios", price: 589.9, images: [relogios, hero], badge: "Lançamento", tags: ["novidades", "mais-vendidos"], description: desc, material: "Caixa em aço, pulseira em couro (exemplo)", features: ["Mostrador preto", "Pulseira em couro", "Exemplo demonstrativo"], variants: { label: "Pulseira", options: ["Couro preto", "Aço"] } },
  { slug: "cronografo-branco", name: "Cronógrafo Mostrador Branco", category: "relogios", price: 749.9, compareAtPrice: 899.9, images: [crono, relogios], badge: "Promoção", tags: ["ofertas", "mais-vendidos"], description: desc, material: "Caixa e pulseira em aço (exemplo)", features: ["Cronógrafo", "Calendário", "Exemplo demonstrativo"] },
  { slug: "smartwatch-sport-preto", name: "Smartwatch Sport Preto", category: "smartwatches", price: 429.9, images: [smart], badge: "Lançamento", tags: ["novidades"], description: desc, material: "Caixa em alumínio, pulseira em silicone (exemplo)", features: ["Tela touch", "Pulseira em silicone", "Exemplo demonstrativo"], variants: { label: "Tamanho", options: ["41 mm", "45 mm"] } },
  { slug: "kit-aneis-prata", name: "Kit Anéis Prata 925", category: "prata-925", price: 259.9, compareAtPrice: 319.9, images: [prata, brincos], badge: "Promoção", tags: ["ofertas", "mais-vendidos"], description: desc, material: "Prata 925 (exemplo)", features: ["Três peças", "Acabamento polido", "Exemplo demonstrativo"], variants: { label: "Aro", options: ["14", "16", "18", "20", "22"] } },
  { slug: "argolas-e-anel-prata", name: "Argolas e Anel Signet Prata 925", category: "prata-925", price: 219.9, images: [brincos, prata], tags: ["novidades"], description: desc, material: "Prata 925 (exemplo)", features: ["Argolas médias", "Anel signet", "Exemplo demonstrativo"] },
  { slug: "pulseira-grumet-aco", name: "Pulseira Grumet Aço Inoxidável", category: "aco-inoxidavel", price: 189.9, images: [aco], tags: ["mais-vendidos", "novidades"], description: desc, material: "Aço inoxidável (exemplo)", features: ["Elo grumet", "Placa lisa", "Exemplo demonstrativo"], variants: { label: "Comprimento", options: ["19 cm", "21 cm"] } },
  { slug: "corrente-grumet-aco", name: "Corrente Grumet Aço Inoxidável", category: "aco-inoxidavel", price: 239.9, compareAtPrice: 279.9, images: [aco, hero], badge: "Promoção", tags: ["ofertas"], description: desc, material: "Aço inoxidável (exemplo)", features: ["Elo grumet", "Fecho reforçado", "Exemplo demonstrativo"], variants: { label: "Comprimento", options: ["50 cm", "60 cm", "70 cm"] } },
  { slug: "colar-gota-banhado-18k", name: "Colar Gota Banhado a Ouro 18k", category: "banhados-ouro-18k", price: 169.9, images: [ouro], badge: "Lançamento", tags: ["novidades", "ofertas"], description: desc, material: "Banho de ouro 18k (exemplo)", features: ["Pingente gota", "Ponto de luz", "Exemplo demonstrativo"] },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const byTag = (tag: Product["tags"][number]) => products.filter((p) => p.tags.includes(tag));
