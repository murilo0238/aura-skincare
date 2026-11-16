import { getCategory, isCategorySlug, type CategorySlug } from "@/data/categories";
import type { Product } from "@/data/products";
import { normalize } from "./format";

export const priceRanges = [
  { id: "ate-150", label: "Até R$ 150", min: 0, max: 15000 },
  { id: "150-200", label: "R$ 150 a R$ 200", min: 15000, max: 20000 },
  { id: "acima-200", label: "Acima de R$ 200", min: 20000, max: Infinity },
] as const;

export const sortOptions = [
  { id: "destaque", label: "Ordem do ritual" },
  { id: "menor-preco", label: "Menor preço" },
  { id: "maior-preco", label: "Maior preço" },
  { id: "nome", label: "Nome, A a Z" },
] as const;

export type PriceRangeId = (typeof priceRanges)[number]["id"];
export type SortId = (typeof sortOptions)[number]["id"];

export interface CatalogQuery {
  category: CategorySlug | null;
  price: PriceRangeId | null;
  sort: SortId;
  search: string;
}

type ParamsLike = { get(name: string): string | null };

/** Lê e valida a consulta a partir da URL — valores inválidos são ignorados. */
export function parseCatalogQuery(params: ParamsLike): CatalogQuery {
  const category = params.get("categoria");
  const price = params.get("preco");
  const sort = params.get("ordem");
  return {
    category: category && isCategorySlug(category) ? category : null,
    price: priceRanges.some((r) => r.id === price) ? (price as PriceRangeId) : null,
    sort: sortOptions.some((s) => s.id === sort) ? (sort as SortId) : "destaque",
    search: (params.get("busca") ?? "").slice(0, 80),
  };
}

export function catalogQueryToSearch(query: CatalogQuery): string {
  const params = new URLSearchParams();
  if (query.search.trim()) params.set("busca", query.search.trim());
  if (query.category) params.set("categoria", query.category);
  if (query.price) params.set("preco", query.price);
  if (query.sort !== "destaque") params.set("ordem", query.sort);
  const s = params.toString();
  return s ? `?${s}` : "";
}

function searchableText(p: Product): string {
  return normalize([p.name, `aura ${p.name}`, p.kind, p.summary, p.tagline, getCategory(p.category)?.name ?? "", p.size].join(" "));
}

export function matchesSearch(p: Product, search: string): boolean {
  const terms = normalize(search).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const haystack = searchableText(p);
  return terms.every((t) => haystack.includes(t));
}

export function filterProducts(list: readonly Product[], query: CatalogQuery): Product[] {
  const range = priceRanges.find((r) => r.id === query.price);
  const filtered = list.filter(
    (p) =>
      (!query.category || p.category === query.category) &&
      (!range || (p.priceCents >= range.min && p.priceCents < range.max)) &&
      matchesSearch(p, query.search),
  );
  switch (query.sort) {
    case "menor-preco":
      return filtered.toSorted((a, b) => a.priceCents - b.priceCents);
    case "maior-preco":
      return filtered.toSorted((a, b) => b.priceCents - a.priceCents);
    case "nome":
      return filtered.toSorted((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    default:
      return filtered;
  }
}

export function hasActiveFilters(query: CatalogQuery): boolean {
  return Boolean(query.category || query.price || query.search.trim());
}
