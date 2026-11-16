import { ProductCard } from "@/components/product/product-card";
import { TextLink } from "@/components/ui/button";
import { getProductsBySlugs } from "@/data/products";

const featured = getProductsBySlugs(["cleanse", "balance", "protect"]);

/** Três produtos do ritual da manhã, em colunas desencontradas. */
export function FeaturedProducts() {
  return (
    <section aria-labelledby="destaques-title" className="shell pt-24 pb-8 lg:pt-36">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="destaques-title" className="font-display text-display-m max-w-[16ch]">
            Para começar o dia
          </h2>
          <p className="mt-3 max-w-md text-tinta/75">Limpar, hidratar e concluir: os três gestos mais pedidos da manhã.</p>
        </div>
        <TextLink href="/produtos">Ver todos os produtos</TextLink>
      </div>

      <ul className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-x-8">
        {featured.map((p, i) => (
          <li key={p.slug} className={i === 1 ? "lg:mt-24" : i === 2 ? "sm:col-span-2 sm:mx-auto sm:w-1/2 lg:col-span-1 lg:mx-0 lg:mt-48 lg:w-auto" : undefined}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}
