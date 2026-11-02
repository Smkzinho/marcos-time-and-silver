// Informações comerciais editáveis. Valores atuais são demonstrativos.
export const commerce = {
  currency: "BRL",
  installments: { max: 10, minValue: 50 }, // regra de parcelamento sem juros (exemplo)
  paymentMethods: [] as string[], // ex.: ["Pix", "Cartão de crédito", "Boleto"]
  shippingNote: "Opções e prazos de entrega serão calculados na finalização da compra, conforme o seu CEP.",
  cartShippingNote: "Frete calculado na finalização.",
};
