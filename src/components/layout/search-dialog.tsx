"use client";

import { AnimatePresence, m } from "motion/react";
import { Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDeferredValue, useEffect, useRef, useState } from "react";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { useDialogBehavior } from "@/hooks/use-dialog-behavior";
import { matchesSearch } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { useUi } from "@/store/ui";

function SearchPanel({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const results = deferred.trim() ? products.filter((p) => matchesSearch(p, deferred)) : [];

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const q = query.trim();
    onClose();
    router.push(q ? `/produtos?busca=${encodeURIComponent(q)}` : "/produtos");
  }

  return (
    <div className="shell pt-3 pb-8 lg:pt-6 lg:pb-12">
      <form role="search" onSubmit={submit} className="flex items-center gap-3 border-b border-tinta/25 pb-3 focus-within:border-tinta">
        <Search className="size-5 shrink-0 text-pedra" strokeWidth={1.4} aria-hidden />
        <label htmlFor="site-search" className="sr-only">
          Buscar na coleção
        </label>
        <input
          id="site-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por produto, textura ou momento…"
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="search"
          className="font-display min-w-0 flex-1 bg-transparent text-[1.6rem] leading-tight placeholder:text-pedra/70 focus:outline-none lg:text-[2.2rem]"
        />
        <button
          type="button"
          onClick={onClose}
          className="-mr-2.5 inline-flex size-11 shrink-0 items-center justify-center rounded-full"
          aria-label="Fechar busca"
        >
          <X className="size-5.5" strokeWidth={1.4} aria-hidden />
        </button>
      </form>

      <div className="mt-6 min-h-24" aria-live="polite">
        {deferred.trim() === "" ? (
          <div>
            <p className="text-sm text-pedra">Explore por categoria</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/produtos?categoria=${c.slug}`}
                    onClick={onClose}
                    className="inline-flex min-h-11 items-center rounded-full border border-tinta/20 px-5 text-[0.9375rem] transition-colors hover:border-tinta"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : results.length === 0 ? (
          <p className="text-[0.9375rem] text-pedra">
            Nenhum produto encontrado para “{deferred.trim()}”. Experimente “sérum”, “creme” ou “noite”.
          </p>
        ) : (
          <>
            <p className="text-sm text-pedra">
              {results.length} {results.length === 1 ? "resultado" : "resultados"}
            </p>
            <ul className="mt-3 grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/produtos/${p.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 rounded-sm p-2 transition-colors hover:bg-linho"
                  >
                    <Image src={p.images.studio} alt="" sizes="64px" className="h-20 w-16 object-cover" />
                    <span className="min-w-0 flex-1">
                      <span className="font-display block text-xl leading-tight">{p.name}</span>
                      <span className="block truncate text-sm text-pedra">{p.kind}</span>
                    </span>
                    <span className="tabular text-sm">{formatPrice(p.priceCents)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export function SearchDialog() {
  const isOpen = useUi((s) => s.panel === "search");
  const close = useUi((s) => s.close);
  const openPanel = useUi((s) => s.open);
  const panelRef = useRef<HTMLDivElement>(null);
  useDialogBehavior(isOpen, panelRef, close);

  // Atalho "/" para abrir a busca (fora de campos de texto).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, select, [contenteditable='true']")) return;
      e.preventDefault();
      openPanel("search");
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openPanel]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-50">
          <m.div
            className="absolute inset-0 bg-tinta/30 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            aria-hidden
          />
          <m.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Buscar produtos"
            className="relative max-h-[85svh] overflow-y-auto overscroll-contain bg-alabastro shadow-[0_30px_60px_-30px_rgb(32_27_25/0.35)]"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <SearchPanel onClose={close} />
          </m.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
