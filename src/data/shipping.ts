/** Opções de frete FICTÍCIAS — nenhuma transportadora é consultada. */
export const shippingOptions = [
  {
    id: "padrao",
    label: "Entrega padrão",
    detail: "Prazo fictício de 5 a 8 dias úteis",
    priceCents: 1990,
    freeFromCents: 40000,
  },
  {
    id: "expressa",
    label: "Entrega expressa",
    detail: "Prazo fictício de 2 a 3 dias úteis",
    priceCents: 3490,
    freeFromCents: null,
  },
] as const;

export type ShippingId = (typeof shippingOptions)[number]["id"];

export function shippingCost(id: ShippingId, subtotalCents: number): number {
  const option = shippingOptions.find((o) => o.id === id) ?? shippingOptions[0];
  if (option.freeFromCents !== null && subtotalCents >= option.freeFromCents) return 0;
  return option.priceCents;
}

export const FREE_SHIPPING_FROM = shippingOptions[0].freeFromCents;
