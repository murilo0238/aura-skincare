"use client";

import { AnimatePresence, m } from "motion/react";
import { Menu, Search, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/format";
import { useCartCount, useCartHydrated } from "@/store/cart";
import { useUi } from "@/store/ui";
import { primaryNav } from "./site-nav";

function BagCount({ className }: { className?: string }) {
  const hydrated = useCartHydrated();
  const count = useCartCount();
  const visible = hydrated && count > 0;
  return (
    <AnimatePresence initial={false} mode="popLayout">
      {visible ? (
        <m.span
          key={count}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 28 }}
          className={cn("tabular inline-grid place-items-center", className)}
        >
          {count}
        </m.span>
      ) : null}
    </AnimatePresence>
  );
}

export function SiteHeader() {
  const open = useUi((s) => s.open);
  const hydrated = useCartHydrated();
  const count = useCartCount();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const bagLabel = hydrated && count > 0 ? `Abrir sacola, ${count} ${count === 1 ? "item" : "itens"}` : "Abrir sacola";

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-alabastro/88 backdrop-blur-md backdrop-saturate-150 transition-[border-color] duration-500",
        scrolled ? "border-tinta/10" : "border-transparent",
      )}
    >
      <div className="shell grid h-(--header-h) grid-cols-[1fr_auto_1fr] items-center gap-4">
        {/* esquerda */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => open("menu")}
            className="-ml-2.5 inline-flex size-11 items-center justify-center rounded-full lg:hidden"
            aria-label="Abrir menu"
            aria-haspopup="dialog"
          >
            <Menu className="size-5.5" strokeWidth={1.4} aria-hidden />
          </button>
          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="relative py-2 text-[0.9375rem] text-tinta/80 transition-colors hover:text-tinta after:absolute after:inset-x-0 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-500 after:ease-(--ease-aura) hover:after:scale-x-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* centro */}
        <Link href="/" className="wordmark text-[1.3rem] leading-none lg:text-[1.55rem]" aria-label="AURA, página inicial" translate="no">
          AURA
        </Link>

        {/* direita */}
        <div className="flex items-center justify-end gap-1 lg:gap-6">
          <button
            type="button"
            onClick={() => open("search")}
            className="inline-flex size-11 items-center justify-center gap-2 rounded-full text-[0.9375rem] text-tinta/80 transition-colors hover:text-tinta lg:size-auto lg:py-2"
            aria-label="Buscar produtos"
            aria-haspopup="dialog"
          >
            <Search className="size-5 lg:size-4" strokeWidth={1.4} aria-hidden />
            <span className="hidden lg:inline">Buscar</span>
          </button>
          <button
            type="button"
            onClick={() => open("cart")}
            className="relative -mr-2.5 inline-flex size-11 items-center justify-center gap-2 rounded-full text-[0.9375rem] text-tinta/80 transition-colors hover:text-tinta lg:mr-0 lg:size-auto lg:py-2"
            aria-label={bagLabel}
            aria-haspopup="dialog"
          >
            <ShoppingBag className="size-5 lg:hidden" strokeWidth={1.4} aria-hidden />
            <span className="hidden lg:inline">Sacola</span>
            <BagCount className="absolute top-1 right-0.5 min-w-4.5 rounded-full bg-cacau px-1 text-[0.6875rem] leading-4.5 font-medium text-marfim lg:static lg:min-w-6 lg:bg-rose-claro/70 lg:text-[0.75rem] lg:leading-6 lg:text-cacau" />
          </button>
        </div>
      </div>
    </header>
  );
}
