"use client";

import { AnimatePresence, m } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { QuantityStepper } from "@/components/cart/quantity-stepper";
import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/format";

/**
 * Bloco de compra: quantidade + adicionar. No mobile, quando o botão
 * principal sai da tela, uma barra fixa de compra aparece no rodapé.
 */
export function ProductPurchase({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [showBar, setShowBar] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  // Listener de scroll (e não IntersectionObserver): saltos de rolagem — fling, âncora,
  // restauração ao voltar — passam de "abaixo" para "acima" sem cruzar a tela, e o
  // observer não dispararia nesse caso.
  useEffect(() => {
    const el = anchorRef.current;
    if (!el) return;
    let frame = 0;
    const check = () => {
      frame = 0;
      setShowBar(el.getBoundingClientRect().bottom < 0);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const total = product.priceCents * quantity;

  return (
    <>
      <div ref={anchorRef} className="flex flex-col gap-3 sm:flex-row">
        <QuantityStepper value={quantity} onChange={setQuantity} label={`Quantidade de AURA ${product.name}`} className="self-start" />
        <AddToCartButton
          slugs={product.slug}
          quantity={quantity}
          className="flex-1"
          ariaLabel={`Adicionar ${quantity} ${quantity === 1 ? "unidade" : "unidades"} de AURA ${product.name} à sacola`}
        >
          Adicionar à sacola<span className="tabular opacity-70">{formatPrice(total)}</span>
        </AddToCartButton>
      </div>

      <AnimatePresence>
        {showBar ? (
          <m.div
            className="fixed inset-x-0 bottom-0 z-30 border-t border-tinta/10 bg-alabastro/95 px-(--gutter) pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-4">
              <div className="min-w-0 flex-1">
                <p className="font-display truncate text-xl leading-tight">{product.name}</p>
                <p className="tabular text-sm text-pedra">
                  {quantity > 1 ? `${quantity} × ` : ""}
                  {formatPrice(product.priceCents)}
                </p>
              </div>
              <AddToCartButton
                slugs={product.slug}
                quantity={quantity}
                className="px-6"
                ariaLabel={`Adicionar AURA ${product.name} à sacola`}
              >
                Adicionar
              </AddToCartButton>
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
