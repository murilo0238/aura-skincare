import type { Metadata } from "next";
import { CheckoutView } from "@/components/checkout/checkout-view";

export const metadata: Metadata = {
  title: "Checkout demonstrativo",
  description: "Checkout demonstrativo da AURA. Nenhum pagamento é solicitado e nenhum pedido é processado.",
  robots: { index: false, follow: true },
};

export default function CheckoutPage() {
  return (
    <div className="shell pt-8 pb-24 lg:pt-14 lg:pb-36">
      <CheckoutView />
    </div>
  );
}
