"use client";

import { AnimatePresence, m } from "motion/react";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import { products } from "@/data/products";
import { FREE_SHIPPING_FROM } from "@/data/shipping";
import { useDialogBehavior } from "@/hooks/use-dialog-behavior";
import { cn, formatPrice } from "@/lib/format";
import { detailLines, useCart, useCartHydrated, type CartLine, type DetailedLine } from "@/store/cart";
import { useUi } from "@/store/ui";
import { QuantityStepper } from "./quantity-stepper";

const ease = [0.22, 1, 0.36, 1] as const;

function CartLineItem({
  line,
  highlight,
  onNavigate,
  onRemove,
}: {
  line: DetailedLine;
  highlight: boolean;
  onNavigate: () => void;
  onRemove: () => void;
}) {
  const setQuantity = useCart((s) => s.setQuantity);
  const { product } = line;
  return (
    <m.li
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, height: 0, paddingBlock: 0 }}
      transition={{ duration: 0.35, ease }}
      className="relative flex gap-4 overflow-hidden border-b border-tinta/10 py-5"
    >
      {highlight ? (
        <m.span
          aria-hidden
          className="absolute inset-0 -z-10 bg-rose-claro/40"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.6, delay: 0.4 }}
        />
      ) : null}
      <Link href={`/produtos/${product.slug}`} onClick={onNavigate} className="shrink-0" tabIndex={-1} aria-hidden>
        <Image src={product.images.studio} alt="" sizes="88px" className="h-28 w-22 object-cover" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={`/produtos/${product.slug}`} onClick={onNavigate} className="font-display text-[1.4rem] leading-tight hover:underline" translate="no">
              AURA {product.name}
            </Link>
            <p className="text-sm text-pedra">
              {product.kind}, {product.size}
            </p>
          </div>
          <p className="tabular shrink-0 text-[0.9375rem]">{formatPrice(line.totalCents)}</p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <QuantityStepper
            size="sm"
            value={line.quantity}
            onChange={(q) => setQuantity(product.slug, q)}
            label={`Quantidade de AURA ${product.name}`}
          />
          <button
            type="button"
            onClick={onRemove}
            className="min-h-10 px-1 text-sm text-pedra underline decoration-current/30 underline-offset-4 hover:text-tinta hover:decoration-current"
          >
            Remover<span className="sr-only"> AURA {product.name}</span>
          </button>
        </div>
      </div>
    </m.li>
  );
}

function EmptyCart({ onNavigate }: { onNavigate: () => void }) {
  const suggestions = products.slice(0, 3);
  return (
    <div className="flex flex-1 flex-col px-6 py-8 sm:px-8">
      <p className="font-display text-display-s">Sua sacola está vazia.</p>
      <p className="mt-3 max-w-xs text-[0.9375rem] text-pedra">Comece pelo primeiro gesto do ritual ou explore a coleção completa.</p>
      <ul className="mt-8 grid grid-cols-3 gap-3">
        {suggestions.map((p) => (
          <li key={p.slug}>
            <Link href={`/produtos/${p.slug}`} onClick={onNavigate} className="group block">
              <Image
                src={p.images.studio}
                alt=""
                sizes="140px"
                className="aspect-4/5 w-full object-cover transition-transform duration-700 ease-(--ease-aura) group-hover:scale-[1.03]"
              />
              <span className="font-display mt-2 block text-lg leading-tight">{p.name}</span>
            </Link>
          </li>
        ))}
      </ul>
      <ButtonLink href="/produtos" onClick={onNavigate} className="mt-auto w-full" variant="solid">
        Ver a coleção
      </ButtonLink>
    </div>
  );
}

export function CartDrawer() {
  const isOpen = useUi((s) => s.panel === "cart");
  const lastAdded = useUi((s) => s.lastAdded);
  const close = useUi((s) => s.close);
  const lines = useCart((s) => s.lines);
  const hydrated = useCartHydrated();
  const remove = useCart((s) => s.remove);
  const restore = useCart((s) => s.restore);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useDialogBehavior(isOpen, panelRef, close, closeRef);

  // Remoção com janela de "desfazer" (6 s).
  const [removed, setRemoved] = useState<{ line: CartLine; index: number; name: string } | null>(null);
  useEffect(() => {
    if (!removed) return;
    const t = setTimeout(() => setRemoved(null), 6000);
    return () => clearTimeout(t);
  }, [removed]);

  function handleRemove(line: DetailedLine, index: number) {
    remove(line.slug);
    setRemoved({ line: { slug: line.slug, quantity: line.quantity }, index, name: line.product.name });
  }

  function handleUndo() {
    if (!removed) return;
    restore(removed.line, removed.index);
    setRemoved(null);
  }

  const detailed = detailLines(lines);
  const count = detailed.reduce((s, l) => s + l.quantity, 0);
  const subtotal = detailed.reduce((s, l) => s + l.totalCents, 0);
  const missingForFree = FREE_SHIPPING_FROM ? Math.max(0, FREE_SHIPPING_FROM - subtotal) : 0;
  const recentlyAdded = lastAdded?.slug ?? null;

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-50">
          <m.div
            className="absolute inset-0 bg-tinta/35 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={close}
            aria-hidden
          />
          <m.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            className="absolute inset-y-0 right-0 flex w-full max-w-[28rem] flex-col bg-alabastro shadow-[-30px_0_60px_-30px_rgb(32_27_25/0.4)]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.55, ease }}
          >
            <div className="flex h-(--header-h) shrink-0 items-center justify-between border-b border-tinta/10 px-6 sm:px-8">
              <h2 id="cart-title" className="font-display text-[1.6rem] leading-none">
                Sacola{" "}
                {hydrated && count > 0 ? <span className="tabular font-sans text-base text-pedra">({count})</span> : null}
              </h2>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                className="-mr-2.5 inline-flex size-11 items-center justify-center rounded-full"
                aria-label="Fechar sacola"
              >
                <X className="size-5.5" strokeWidth={1.4} aria-hidden />
              </button>
            </div>

            <div role="status" aria-live="polite">
              {removed ? (
                <div className="flex items-center justify-between gap-4 border-b border-tinta/10 bg-linho px-6 py-3 text-sm sm:px-8">
                  <span>
                    <span translate="no">AURA {removed.name}</span> saiu da sacola.
                  </span>
                  <button
                    type="button"
                    onClick={handleUndo}
                    className="min-h-10 shrink-0 px-1 font-medium underline decoration-current/40 underline-offset-4 hover:decoration-current"
                  >
                    Desfazer
                  </button>
                </div>
              ) : null}
            </div>

            {!hydrated ? (
              <div className="flex-1" aria-busy="true" />
            ) : detailed.length === 0 ? (
              <EmptyCart onNavigate={close} />
            ) : (
              <>
                <div className="flex-1 overflow-y-auto overscroll-contain px-6 sm:px-8">
                  {FREE_SHIPPING_FROM ? (
                    <p className="pt-5 text-sm text-pedra">
                      {missingForFree > 0
                        ? `Faltam ${formatPrice(missingForFree)} para o frete padrão grátis (demonstrativo).`
                        : "Seu pedido tem frete padrão grátis (demonstrativo)."}
                    </p>
                  ) : null}
                  <ul>
                    <AnimatePresence initial={false}>
                      {detailed.map((line, index) => (
                        <CartLineItem
                          key={line.slug}
                          line={line}
                          highlight={recentlyAdded === line.slug}
                          onNavigate={close}
                          onRemove={() => handleRemove(line, index)}
                        />
                      ))}
                    </AnimatePresence>
                  </ul>
                </div>
                <div className="shrink-0 border-t border-tinta/10 bg-linho px-6 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-8">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[0.9375rem]">Subtotal</span>
                    <span className="tabular font-display text-[1.6rem]">{formatPrice(subtotal)}</span>
                  </div>
                  <p className="mt-1 text-sm text-pedra">Frete fictício calculado no checkout.</p>
                  <ButtonLink href="/checkout" onClick={close} className="mt-4 w-full">
                    Finalizar compra
                  </ButtonLink>
                  <button
                    type="button"
                    onClick={close}
                    className={cn("mt-2 min-h-11 w-full text-[0.9375rem] text-pedra underline decoration-current/30 underline-offset-4 hover:text-tinta")}
                  >
                    Continuar comprando
                  </button>
                </div>
              </>
            )}
          </m.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
