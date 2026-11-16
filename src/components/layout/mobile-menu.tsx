"use client";

import { AnimatePresence, m } from "motion/react";
import { X } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { categories } from "@/data/categories";
import { useDialogBehavior } from "@/hooks/use-dialog-behavior";
import { useUi } from "@/store/ui";

const links = [
  { href: "/produtos", label: "Toda a coleção" },
  { href: "/#rotina", label: "Rotina de cuidados" },
  { href: "/#filosofia", label: "Filosofia" },
  { href: "/#descobrir", label: "Encontre seu cuidado" },
];

export function MobileMenu() {
  const isOpen = useUi((s) => s.panel === "menu");
  const close = useUi((s) => s.close);
  const panelRef = useRef<HTMLDivElement>(null);
  useDialogBehavior(isOpen, panelRef, close);

  return (
    <AnimatePresence>
      {isOpen ? (
        <m.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto overscroll-contain bg-alabastro lg:hidden"
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="shell flex h-(--header-h) shrink-0 items-center justify-between">
            <span className="wordmark text-[1.3rem] leading-none" aria-hidden translate="no">
              AURA
            </span>
            <button
              type="button"
              onClick={close}
              className="-mr-2.5 inline-flex size-11 items-center justify-center rounded-full"
              aria-label="Fechar menu"
            >
              <X className="size-5.5" strokeWidth={1.4} aria-hidden />
            </button>
          </div>

          <nav aria-label="Menu móvel" className="shell flex flex-1 flex-col pt-8 pb-10">
            <ul className="space-y-1">
              {links.map((item, i) => (
                <m.li
                  key={item.href}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link href={item.href} onClick={close} className="font-display block py-2 text-[2.4rem] leading-[1.1]">
                    {item.label}
                  </Link>
                </m.li>
              ))}
            </ul>

            <div className="mt-10">
              <p className="text-sm text-pedra">Categorias</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {categories.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/produtos?categoria=${c.slug}`}
                      onClick={close}
                      className="inline-flex min-h-11 items-center rounded-full border border-tinta/20 px-5 text-[0.9375rem]"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-auto pt-12 text-sm leading-relaxed text-pedra">
              AURA é uma marca fictícia. Produtos, preços e pedidos são demonstrativos.
            </p>
          </nav>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
