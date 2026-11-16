"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getProduct, type Product } from "@/data/products";

export const MAX_QUANTITY = 10;
const STORAGE_KEY = "aura:cart";

export interface CartLine {
  slug: string;
  quantity: number;
}

interface CartState {
  lines: CartLine[];
  add: (slug: string, quantity?: number) => void;
  addMany: (slugs: readonly string[]) => void;
  setQuantity: (slug: string, quantity: number) => void;
  remove: (slug: string) => void;
  /** Recoloca uma linha removida na posição original (desfazer). */
  restore: (line: CartLine, index: number) => void;
  clear: () => void;
}

const clamp = (n: number) => Math.max(1, Math.min(MAX_QUANTITY, Math.round(n)));

/** Mantém apenas linhas válidas: produto existente e quantidade dentro do limite. */
function sanitize(lines: unknown): CartLine[] {
  if (!Array.isArray(lines)) return [];
  const seen = new Set<string>();
  const out: CartLine[] = [];
  for (const line of lines) {
    if (!line || typeof line !== "object") continue;
    const { slug, quantity } = line as Partial<CartLine>;
    if (typeof slug !== "string" || seen.has(slug) || !getProduct(slug)) continue;
    if (typeof quantity !== "number" || !Number.isFinite(quantity)) continue;
    seen.add(slug);
    out.push({ slug, quantity: clamp(quantity) });
  }
  return out;
}

function addTo(lines: CartLine[], slug: string, quantity: number): CartLine[] {
  if (!getProduct(slug)) return lines;
  const existing = lines.find((l) => l.slug === slug);
  if (existing) {
    return lines.map((l) => (l.slug === slug ? { ...l, quantity: clamp(l.quantity + quantity) } : l));
  }
  return [...lines, { slug, quantity: clamp(quantity) }];
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      add: (slug, quantity = 1) => set((s) => ({ lines: addTo(s.lines, slug, quantity) })),
      addMany: (slugs) => set((s) => ({ lines: slugs.reduce((acc, slug) => addTo(acc, slug, 1), s.lines) })),
      setQuantity: (slug, quantity) =>
        set((s) => ({ lines: s.lines.map((l) => (l.slug === slug ? { ...l, quantity: clamp(quantity) } : l)) })),
      remove: (slug) => set((s) => ({ lines: s.lines.filter((l) => l.slug !== slug) })),
      restore: (line, index) =>
        set((s) => {
          if (s.lines.some((l) => l.slug === line.slug)) return s;
          const lines = [...s.lines];
          lines.splice(Math.min(index, lines.length), 0, { slug: line.slug, quantity: clamp(line.quantity) });
          return { lines };
        }),
      clear: () => set({ lines: [] }),
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      // Só o essencial: slug e quantidade. Nada de dados pessoais.
      partialize: (s) => ({ lines: s.lines }),
      storage: createJSONStorage(() => localStorage),
      // A reidratação é disparada após a hidratação do React (CartPersistence),
      // assim servidor e primeiro render do cliente são idênticos.
      skipHydration: true,
      merge: (persisted, current) => ({
        ...current,
        lines: sanitize((persisted as Partial<CartState> | undefined)?.lines),
      }),
    },
  ),
);

/* ------------------------------------------------------------------ */

const subscribeHydration = (cb: () => void) => useCart.persist.onFinishHydration(cb);
const getHydrated = () => useCart.persist.hasHydrated();
const getServerHydrated = () => false;

/** `true` somente depois que o carrinho foi lido do localStorage. */
export function useCartHydrated(): boolean {
  return useSyncExternalStore(subscribeHydration, getHydrated, getServerHydrated);
}

export function useCartCount(): number {
  return useCart((s) => s.lines.reduce((sum, l) => sum + l.quantity, 0));
}

export interface DetailedLine extends CartLine {
  product: Product;
  totalCents: number;
}

export function detailLines(lines: CartLine[]): DetailedLine[] {
  return lines.flatMap((l) => {
    const product = getProduct(l.slug);
    return product ? [{ ...l, product, totalCents: product.priceCents * l.quantity }] : [];
  });
}

export function subtotalOf(lines: CartLine[]): number {
  return detailLines(lines).reduce((sum, l) => sum + l.totalCents, 0);
}

export const CART_STORAGE_KEY = STORAGE_KEY;
