"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import { useEffect, type ReactNode } from "react";
import { CART_STORAGE_KEY, useCart } from "@/store/cart";

/** Lê o carrinho do localStorage após a hidratação e sincroniza entre abas. */
function CartPersistence() {
  useEffect(() => {
    void useCart.persist.rehydrate();
    const onStorage = (event: StorageEvent) => {
      if (event.key === CART_STORAGE_KEY) void useCart.persist.rehydrate();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <CartPersistence />
        {children}
      </LazyMotion>
    </MotionConfig>
  );
}
