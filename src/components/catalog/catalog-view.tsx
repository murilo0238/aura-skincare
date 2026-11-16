"use client";

import { AnimatePresence, m } from "motion/react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { categories, getCategory } from "@/data/categories";
import { products } from "@/data/products";
import { useDialogBehavior } from "@/hooks/use-dialog-behavior";
import {
  catalogQueryToSearch,
  filterProducts,
  hasActiveFilters,
  parseCatalogQuery,
  priceRanges,
  sortOptions,
  type CatalogQuery,
} from "@/lib/catalog";
import { cn, pluralize } from "@/lib/format";

/* ------------------------------------------------------------------ */
/* Controles reutilizados no desktop e na folha de filtros do mobile   */
/* ------------------------------------------------------------------ */

function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-11 shrink-0 items-center rounded-full border px-5 text-[0.9375rem] transition-colors duration-300",
        selected ? "border-cacau bg-cacau text-marfim" : "border-tinta/20 hover:border-tinta",
      )}
    >
      {children}
    </button>
  );
}

function CategoryChips({ query, update }: { query: CatalogQuery; update: (p: Partial<CatalogQuery>) => void }) {
  return (
    <>
      <Chip selected={!query.category} onClick={() => update({ category: null })}>
        Todas
      </Chip>
      {categories.map((c) => (
        <Chip
          key={c.slug}
          selected={query.category === c.slug}
          onClick={() => update({ category: query.category === c.slug ? null : c.slug })}
        >
          {c.name}
        </Chip>
      ))}
    </>
  );
}

function PriceChips({ query, update }: { query: CatalogQuery; update: (p: Partial<CatalogQuery>) => void }) {
  return (
    <>
      {priceRanges.map((r) => (
        <Chip key={r.id} selected={query.price === r.id} onClick={() => update({ price: query.price === r.id ? null : r.id })}>
          {r.label}
        </Chip>
      ))}
    </>
  );
}

function SortSelect({
  query,
  update,
  id,
}: {
  query: CatalogQuery;
  update: (p: Partial<CatalogQuery>) => void;
  id: string;
}) {
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        Ordenar por
      </label>
      <select
        id={id}
        value={query.sort}
        onChange={(e) => update({ sort: e.target.value as CatalogQuery["sort"] })}
        className="min-h-11 w-full cursor-pointer appearance-none rounded-full border border-tinta/20 bg-alabastro py-2 text-tinta pr-11 pl-5 text-[0.9375rem] hover:border-tinta focus:border-tinta"
      >
        {sortOptions.map((o) => (
          <option key={o.id} value={o.id}>
            {o.id === "destaque" ? "Ordenar: ordem do ritual" : `Ordenar: ${o.label.toLowerCase()}`}
          </option>
        ))}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 12 8"
        className="pointer-events-none absolute top-1/2 right-5 h-2 w-3 -translate-y-1/2 fill-none stroke-current"
      >
        <path d="M1 1.5 6 6.5l5-5" strokeWidth="1.3" />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function FilterSheet({
  open,
  onClose,
  query,
  update,
  resultCount,
  clear,
}: {
  open: boolean;
  onClose: () => void;
  query: CatalogQuery;
  update: (p: Partial<CatalogQuery>) => void;
  resultCount: number;
  clear: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useDialogBehavior(open, ref, onClose);
  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <m.div
            className="absolute inset-0 bg-tinta/35"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden
          />
          <m.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby="filtros-title"
            className="absolute inset-x-0 bottom-0 flex max-h-[88svh] flex-col rounded-t-[1.75rem] bg-alabastro"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between px-6 pt-5 pb-3">
              <h2 id="filtros-title" className="font-display text-[1.7rem] leading-none">
                Filtrar e ordenar
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="-mr-2.5 inline-flex size-11 items-center justify-center rounded-full"
                aria-label="Fechar filtros"
              >
                <X className="size-5.5" strokeWidth={1.4} aria-hidden />
              </button>
            </div>
            <div className="flex-1 space-y-8 overflow-y-auto overscroll-contain px-6 py-4">
              <fieldset>
                <legend className="text-sm text-pedra">Categoria</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  <CategoryChips query={query} update={update} />
                </div>
              </fieldset>
              <fieldset>
                <legend className="text-sm text-pedra">Preço</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  <PriceChips query={query} update={update} />
                </div>
              </fieldset>
              <div>
                <p className="text-sm text-pedra" aria-hidden>
                  Ordenação
                </p>
                <div className="mt-3">
                  <SortSelect query={query} update={update} id="sort-mobile" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 border-t border-tinta/10 px-6 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <Button variant="outline" onClick={clear} className="flex-1 px-4">
                Limpar
              </Button>
              <Button onClick={onClose} className="flex-[1.6] px-4">
                Ver {pluralize(resultCount, "produto", "produtos")}
              </Button>
            </div>
          </m.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */

export function CatalogView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const query = parseCatalogQuery(searchParams);
  const [searchText, setSearchText] = useState(query.search);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Mantém o campo sincronizado quando a URL muda por fora (ex.: busca do header).
  const [lastUrlSearch, setLastUrlSearch] = useState(query.search);
  if (query.search !== lastUrlSearch) {
    setLastUrlSearch(query.search);
    setSearchText(query.search);
  }

  const results = filterProducts(products, query);
  const active = hasActiveFilters(query);

  function update(patch: Partial<CatalogQuery>) {
    const next = { ...query, ...patch };
    startTransition(() => {
      router.replace(`${pathname}${catalogQueryToSearch(next)}`, { scroll: false });
    });
  }

  // Busca enquanto digita, com uma pequena espera.
  useEffect(() => {
    if (searchText === query.search) return;
    const t = setTimeout(() => update({ search: searchText }), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `update` lê a URL atual a cada render
  }, [searchText]);

  function clearAll() {
    setSearchText("");
    startTransition(() => router.replace(pathname, { scroll: false }));
  }

  const activeLabels = [
    query.search.trim() && { key: "busca", label: `“${query.search.trim()}”`, clear: () => (setSearchText(""), update({ search: "" })) },
    query.category && { key: "categoria", label: getCategory(query.category)?.name ?? "", clear: () => update({ category: null }) },
    query.price && {
      key: "preco",
      label: priceRanges.find((r) => r.id === query.price)?.label ?? "",
      clear: () => update({ price: null }),
    },
  ].filter(Boolean) as { key: string; label: string; clear: () => void }[];

  return (
    <div>
      {/* Barra de busca e filtros */}
      <div className="sticky top-(--header-h) z-30 -mx-(--gutter) border-b border-tinta/10 bg-alabastro/92 px-(--gutter) py-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <form
            role="search"
            className="relative min-w-0 flex-1 lg:max-w-xs"
            onSubmit={(e) => {
              e.preventDefault();
              update({ search: searchText });
            }}
          >
            <label htmlFor="catalog-search" className="sr-only">
              Buscar no catálogo
            </label>
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-pedra" strokeWidth={1.5} aria-hidden />
            <input
              id="catalog-search"
              type="search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Buscar produtos…"
              autoComplete="off"
              enterKeyHint="search"
              className="min-h-11 w-full rounded-full border border-tinta/20 bg-linho/60 pr-10 pl-11 text-base placeholder:text-pedra/70 hover:border-tinta/40 focus:border-tinta focus:outline-none lg:text-[0.9375rem]"
            />
            {searchText ? (
              <button
                type="button"
                onClick={() => {
                  setSearchText("");
                  update({ search: "" });
                }}
                className="absolute top-1/2 right-1 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-pedra hover:text-tinta"
                aria-label="Limpar busca"
              >
                <X className="size-4" strokeWidth={1.5} aria-hidden />
              </button>
            ) : null}
          </form>

          {/* mobile: abre a folha de filtros */}
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="relative inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-tinta/20 px-4 text-[0.9375rem] lg:hidden"
            aria-haspopup="dialog"
          >
            <SlidersHorizontal className="size-4" strokeWidth={1.5} aria-hidden />
            Filtros
            {query.category || query.price ? (
              <span className="tabular inline-grid size-5 place-items-center rounded-full bg-cacau text-[0.6875rem] text-marfim">
                {(query.category ? 1 : 0) + (query.price ? 1 : 0)}
              </span>
            ) : null}
          </button>

          {/* desktop: filtros em linha */}
          <div className="no-scrollbar hidden min-w-0 flex-1 items-center gap-2 overflow-x-auto lg:flex" role="group" aria-label="Categorias">
            <CategoryChips query={query} update={update} />
          </div>
          <div className="hidden w-60 shrink-0 lg:block">
            <SortSelect query={query} update={update} id="sort-desktop" />
          </div>
        </div>
        <div className="mt-3 hidden items-center gap-2 lg:flex" role="group" aria-label="Faixa de preço">
          <span className="mr-2 text-sm text-pedra">Preço</span>
          <PriceChips query={query} update={update} />
        </div>
      </div>

      {/* Resumo dos resultados */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 pt-8 pb-8 lg:pt-10">
        <p className="tabular text-[0.9375rem]" role="status" aria-live="polite">
          {pluralize(results.length, "produto encontrado", "produtos encontrados")}
        </p>
        {activeLabels.length ? (
          <ul className="flex flex-wrap items-center gap-2" aria-label="Filtros ativos">
            {activeLabels.map((f) => (
              <li key={f.key}>
                <button
                  type="button"
                  onClick={f.clear}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-calcario/70 pr-3 pl-4 text-sm hover:bg-calcario"
                >
                  {f.label}
                  <X className="size-3.5" strokeWidth={1.6} aria-hidden />
                  <span className="sr-only">: remover filtro</span>
                </button>
              </li>
            ))}
            <li>
              <button type="button" onClick={clearAll} className="min-h-9 px-2 text-sm underline decoration-current/30 underline-offset-4 hover:decoration-current">
                Limpar tudo
              </button>
            </li>
          </ul>
        ) : null}
      </div>

      {results.length === 0 ? (
        <div className="max-w-xl py-16 lg:py-24">
          <p className="font-display text-display-m">Nenhum produto com esses critérios.</p>
          <p className="mt-4 text-tinta/75">
            {query.search.trim()
              ? `A busca por “${query.search.trim()}” não encontrou resultados com os filtros atuais. Experimente outro termo, como “sérum” ou “creme”, ou remova um filtro.`
              : "Remova um filtro ou escolha outra faixa de preço para ver mais produtos."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={clearAll}>Limpar filtros</Button>
          </div>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-x-3 gap-y-12 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
          {results.map((p, i) => (
            <li key={p.slug}>
              <ProductCard
                product={p}
                headingLevel="h2"
                preload={i < 2}
                sizes="(min-width: 1024px) 30vw, 48vw"
              />
            </li>
          ))}
          {!active && query.sort === "destaque" ? (
            <li className="col-span-2 lg:col-span-1">
              <Link
                href="/#rotina"
                className="group flex h-full min-h-64 flex-col justify-between bg-cacau p-6 text-marfim on-dark sm:p-8"
              >
                <p className="font-display text-display-s max-w-[12ch]">Monte a rotina completa</p>
                <p className="mt-6 text-[0.9375rem] text-marfim/75">
                  Veja a ordem dos gestos da manhã e da noite e adicione tudo à sacola de uma vez.
                </p>
                <span className="mt-6 text-[0.9375rem] underline decoration-marfim/40 underline-offset-[6px] group-hover:decoration-marfim">
                  Ver a rotina de cuidados
                </span>
              </Link>
            </li>
          ) : null}
        </ul>
      )}

      <FilterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        query={query}
        update={update}
        resultCount={results.length}
        clear={clearAll}
      />
    </div>
  );
}
