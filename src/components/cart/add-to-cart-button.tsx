"use client";

import { AnimatePresence, m } from "motion/react";
import { Check } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { buttonClass, type ButtonVariant } from "@/components/ui/button";
import { cn } from "@/lib/format";
import { useCart } from "@/store/cart";
import { useUi } from "@/store/ui";

interface AddToCartButtonProps {
  slugs: string | readonly string[];
  quantity?: number;
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
  /** Conteúdo do estado de confirmação. */
  addedLabel?: ReactNode;
  /** Nome acessível completo, ex.: "Adicionar AURA Hydrate à sacola". */
  ariaLabel?: string;
  /** Abre o carrinho lateral após adicionar (padrão: sim). */
  openCart?: boolean;
}

/** Adiciona um ou vários produtos ao carrinho e confirma com uma breve troca de estado. */
export function AddToCartButton({
  slugs,
  quantity = 1,
  variant = "solid",
  className,
  children,
  addedLabel = "Adicionado",
  ariaLabel,
  openCart = true,
}: AddToCartButtonProps) {
  const add = useCart((s) => s.add);
  const addMany = useCart((s) => s.addMany);
  const notifyAdded = useUi((s) => s.notifyAdded);
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  function handleClick() {
    const list = typeof slugs === "string" ? [slugs] : slugs;
    if (list.length === 1) add(list[0], quantity);
    else addMany(list);
    if (openCart) notifyAdded(list[list.length - 1]);
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel}
      className={cn(buttonClass(variant), "relative overflow-hidden", className)}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {added ? (
          <m.span
            key="added"
            className="inline-flex items-center gap-2"
            initial={{ y: "120%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-120%", opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Check className="size-4" strokeWidth={1.8} aria-hidden />
            {addedLabel}
          </m.span>
        ) : (
          <m.span
            key="idle"
            className="inline-flex items-center gap-2"
            initial={{ y: "120%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-120%", opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </m.span>
        )}
      </AnimatePresence>
      <span className="sr-only" role="status">
        {added ? "Produto adicionado à sacola." : ""}
      </span>
    </button>
  );
}
