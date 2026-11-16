export const categories = [
  {
    slug: "limpeza",
    name: "Limpeza",
    description: "O começo de cada ritual, de manhã e à noite.",
  },
  {
    slug: "tratamento",
    name: "Tratamento",
    description: "Camadas leves, aplicadas logo após a limpeza.",
  },
  {
    slug: "hidratacao",
    name: "Hidratação",
    description: "Texturas de conforto para o dia e para a noite.",
  },
  {
    slug: "protecao",
    name: "Proteção",
    description: "O gesto que encerra a rotina da manhã.",
  },
] as const;

export type Category = (typeof categories)[number];
export type CategorySlug = Category["slug"];

const categoryMap = new Map<string, Category>(categories.map((c) => [c.slug, c]));

export function getCategory(slug: string): Category | undefined {
  return categoryMap.get(slug);
}

export function isCategorySlug(value: string): value is CategorySlug {
  return categoryMap.has(value);
}
