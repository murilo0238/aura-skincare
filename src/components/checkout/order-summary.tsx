import Image from "next/image";
import type { DetailedLine } from "@/store/cart";
import { formatPrice } from "@/lib/format";

interface OrderSummaryProps {
  lines: DetailedLine[];
  subtotal: number;
  shipping: number;
  shippingLabel: string;
}

export function OrderSummaryLines({ lines }: { lines: DetailedLine[] }) {
  return (
    <ul className="divide-y divide-tinta/10">
      {lines.map((l) => (
        <li key={l.slug} className="flex items-center gap-4 py-4">
          <div className="relative shrink-0">
            <Image src={l.product.images.studio} alt="" sizes="64px" className="h-20 w-16 object-cover" />
            <span className="tabular absolute -top-2 -right-2 inline-grid size-6 place-items-center rounded-full bg-cacau text-xs text-marfim">
              {l.quantity}
              <span className="sr-only"> unidades</span>
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-display text-xl leading-tight">AURA {l.product.name}</p>
            <p className="text-sm text-pedra">{l.product.kind}</p>
          </div>
          <p className="tabular text-[0.9375rem]">{formatPrice(l.totalCents)}</p>
        </li>
      ))}
    </ul>
  );
}

export function OrderTotals({ subtotal, shipping, shippingLabel }: Omit<OrderSummaryProps, "lines">) {
  return (
    <dl className="space-y-2 border-t border-tinta/15 pt-5 text-[0.9375rem]">
      <div className="flex justify-between gap-4">
        <dt>Subtotal</dt>
        <dd className="tabular">{formatPrice(subtotal)}</dd>
      </div>
      <div className="flex justify-between gap-4">
        <dt>
          Frete fictício <span className="text-pedra">({shippingLabel.toLowerCase()})</span>
        </dt>
        <dd className="tabular">{shipping === 0 ? "Grátis" : formatPrice(shipping)}</dd>
      </div>
      <div className="flex items-baseline justify-between gap-4 border-t border-tinta/15 pt-4">
        <dt className="font-medium">Total</dt>
        <dd className="tabular font-display text-[1.9rem] leading-none">{formatPrice(subtotal + shipping)}</dd>
      </div>
    </dl>
  );
}
