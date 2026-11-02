// Identidade e textos institucionais da loja.
// Informações comerciais (parcelamento, pagamento, frete): src/data/commerce.ts.
import { images } from "@/data/images";

export const store = {
  name: "Marcos Joias & Relógios",
  about:
    "Relógios, joias em prata 925, aço inoxidável e peças banhadas a ouro 18k, selecionados para quem valoriza cada detalhe.",
  // Logo oficial: importe o arquivo (ex.: import logo from "@/assets/logo.png") e coloque aqui.
  logoUrl: "" as string,
  instagram: { handle: "", url: "" }, // ex.: { handle: "@marcosjoias", url: "https://instagram.com/marcosjoias" }
  whatsapp: { number: "", url: "" }, // ex.: { number: "(00) 00000-0000", url: "https://wa.me/5500000000000" }
  email: "",
  hero: {
    image: images.hero,
    title: "ESTILO QUE MARCA PRESENÇA.",
    subtitle: "Peças selecionadas para quem valoriza cada detalhe.",
    cta: "CONHEÇA NOSSA COLEÇÃO",
  },
  highlights: [
    { title: "Produtos selecionados", text: "Cada peça é escolhida com atenção ao acabamento, ao design e ao material." },
    { title: "Compra segura", text: "Ambiente preparado para um processo de compra simples e protegido." },
    { title: "Atendimento personalizado", text: "Fale diretamente com a nossa equipe para tirar dúvidas e escolher a peça ideal." },
    { title: "Compromisso com a qualidade", text: "Trabalhamos para que cada cliente receba exatamente o que escolheu." },
  ],
};

export const policies: Record<string, { title: string; body: string }> = {
  atendimento: { title: "Atendimento", body: "Entre em contato com a nossa equipe pelo WhatsApp ou Instagram. Os canais oficiais serão informados aqui." },
  privacidade: { title: "Política de privacidade", body: "Texto da política de privacidade a ser fornecido pela Marcos Joias & Relógios." },
  trocas: { title: "Trocas e devoluções", body: "Texto da política de trocas e devoluções a ser fornecido pela Marcos Joias & Relógios." },
  termos: { title: "Termos de uso", body: "Texto dos termos de uso a ser fornecido pela Marcos Joias & Relógios." },
};
