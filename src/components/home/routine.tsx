"use client";

import { AnimatePresence, m } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useId, useRef, useState } from "react";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { getProduct } from "@/data/products";
import { routines } from "@/data/routines";
import { cn, formatPrice } from "@/lib/format";

const ease = [0.22, 1, 0.36, 1] as const;

export function Routine() {
  const [active, setActive] = useState(0);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const routine = routines[active];
  const steps = routine.steps.flatMap((s) => {
    const product = getProduct(s.slug);
    return product ? [{ ...s, product }] : [];
  });
  const total = steps.reduce((sum, s) => sum + s.product.priceCents, 0);

  function onTabKey(event: React.KeyboardEvent, index: number) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const next = (index + (event.key === "ArrowRight" ? 1 : -1) + routines.length) % routines.length;
    setActive(next);
    tabsRef.current[next]?.focus();
  }

  return (
    <section id="rotina" aria-labelledby="rotina-title" className="bg-linho py-24 lg:py-36">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <h2 id="rotina-title" className="font-display text-display-l">
              Rotina de cuidados
            </h2>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <div role="tablist" aria-label="Momento do dia" className="inline-flex rounded-full border border-tinta/20 p-1">
              {routines.map((r, i) => (
                <button
                  key={r.moment}
                  ref={(el) => {
                    tabsRef.current[i] = el;
                  }}
                  role="tab"
                  type="button"
                  id={`${baseId}-tab-${r.moment}`}
                  aria-selected={i === active}
                  aria-controls={`${baseId}-panel`}
                  tabIndex={i === active ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => onTabKey(e, i)}
                  className={cn(
                    "relative min-h-11 rounded-full px-7 text-[0.9375rem] transition-colors duration-300",
                    i === active ? "text-marfim" : "text-tinta/75 hover:text-tinta",
                  )}
                >
                  {i === active ? (
                    <m.span
                      layoutId={`${baseId}-pill`}
                      className="absolute inset-0 -z-0 rounded-full bg-cacau"
                      transition={{ type: "spring", stiffness: 380, damping: 34 }}
                    />
                  ) : null}
                  <span className="relative">{r.label}</span>
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <m.p
                key={routine.moment}
                className="mt-5 max-w-md text-tinta/75"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {routine.intro}
              </m.p>
            </AnimatePresence>
          </div>
        </div>

        <div
          id={`${baseId}-panel`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${routine.moment}`}
          className="mt-14 lg:mt-20"
        >
          <AnimatePresence mode="wait" initial={false}>
            <m.ol
              key={routine.moment}
              className={cn(
                "grid gap-y-10 sm:grid-cols-2 sm:gap-x-6 lg:gap-x-8",
                steps.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3",
              )}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease }}
            >
              {steps.map((step, i) => (
                <li key={step.slug} className="relative grid grid-cols-[6.5rem_1fr] items-center gap-5 sm:block">
                  <div
                    className="relative aspect-2/3 sm:mx-auto sm:w-[62%]"
                    style={{ "--aura": step.product.aura } as React.CSSProperties}
                  >
                    <div aria-hidden className="aura-glow absolute top-[52%] left-1/2 aspect-square w-[105%] -translate-1/2 rounded-full opacity-70" />
                    <Image
                      src={step.product.images.cutout}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 14vw, (min-width: 640px) 28vw, 104px"
                      className="object-contain"
                    />
                  </div>
                  <div className="sm:mt-6 sm:border-t sm:border-tinta/15 sm:pt-5">
                    <p className="flex items-baseline gap-3">
                      <span className="font-display tabular text-[2rem] leading-none text-rose-tinta" aria-hidden>
                        {i + 1}
                      </span>
                      <span className="font-display text-[1.6rem] leading-none">{step.gesture}</span>
                      <span className="sr-only">: etapa {i + 1}</span>
                    </p>
                    <p className="mt-3 text-[0.9375rem]">
                      <Link href={`/produtos/${step.product.slug}`} className="font-medium underline decoration-current/30 underline-offset-4 hover:decoration-current">
                        AURA {step.product.name}
                      </Link>
                      <span className="text-pedra">, {step.product.kind.toLowerCase()}</span>
                    </p>
                    <p className="mt-1 text-sm text-pedra">{step.note}</p>
                  </div>
                </li>
              ))}
            </m.ol>
          </AnimatePresence>

          <div className="mt-14 flex flex-col gap-5 border-t border-tinta/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[0.9375rem] text-tinta/80">
              Rotina da {routine.label.toLowerCase()} completa, {steps.length} produtos:{" "}
              <span className="tabular font-medium text-tinta">{formatPrice(total)}</span>
            </p>
            <AddToCartButton
              slugs={steps.map((s) => s.slug)}
              addedLabel="Rotina adicionada"
              className="w-full sm:w-auto"
            >
              Adicionar a rotina da {routine.label.toLowerCase()}
            </AddToCartButton>
          </div>
        </div>
      </div>
    </section>
  );
}
