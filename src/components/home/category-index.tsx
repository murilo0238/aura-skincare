import Image from "next/image";
import Link from "next/link";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { pluralize } from "@/lib/format";

const rows = categories.map((c) => {
  const items = products.filter((p) => p.category === c.slug);
  return { ...c, items, lead: items[0] };
});

/**
 * Índice tipográfico de categorias. No desktop, a imagem do produto
 * principal surge ao passar o cursor; no mobile, fica fixa ao lado.
 */
export function CategoryIndex() {
  return (
    <section aria-labelledby="categorias-title" className="shell pt-24 lg:pt-36">
      <div className="grid gap-4 lg:grid-cols-12">
        <h2 id="categorias-title" className="font-display text-display-m lg:col-span-5">
          Por categoria
        </h2>
        <p className="max-w-md text-tinta/75 lg:col-span-5 lg:col-start-8 lg:pt-3">
          Escolha pelo gesto que falta na sua rotina. Cada categoria leva direto aos produtos no catálogo.
        </p>
      </div>

      <ul className="mt-12 border-t border-tinta/15 lg:mt-16">
        {rows.map((row) => (
          <li key={row.slug} className="border-b border-tinta/15">
            <Link
              href={`/produtos?categoria=${row.slug}`}
              className="group relative grid grid-cols-[4.5rem_1fr] items-center gap-x-5 py-5 sm:grid-cols-[5.5rem_1fr_auto] lg:grid-cols-12 lg:gap-8 lg:py-8"
            >
              {/* miniatura no mobile */}
              <span className="relative row-span-2 aspect-4/5 overflow-hidden bg-calcario lg:hidden">
                {row.lead ? (
                  <Image src={row.lead.images.studio} alt="" fill sizes="88px" className="object-cover" />
                ) : null}
              </span>
              <span className="font-display text-[2.1rem] leading-none transition-transform duration-700 ease-(--ease-aura) sm:text-[2.6rem] lg:col-span-5 lg:text-[clamp(3rem,5vw,4.75rem)] lg:group-hover:translate-x-4">
                {row.name}
              </span>
              <span className="text-sm text-pedra sm:col-start-2 sm:row-start-2 lg:col-span-4 lg:col-start-6 lg:row-start-1 lg:text-[0.9375rem]">
                {row.description}
              </span>
              <span className="tabular hidden text-sm text-pedra sm:col-start-3 sm:row-span-2 sm:row-start-1 sm:block lg:col-span-2 lg:col-start-11 lg:row-span-1 lg:text-right">
                {pluralize(row.items.length, "produto", "produtos")}
              </span>

              {/* imagem flutuante no desktop */}
              {row.lead ? (
                <span
                  aria-hidden
                  className="pointer-events-none absolute top-1/2 right-[20%] z-10 hidden aspect-4/5 w-44 -translate-y-1/2 scale-90 rotate-3 overflow-hidden opacity-0 shadow-[0_30px_60px_-25px_rgb(32_27_25/0.45)] transition-[opacity,scale,rotate] duration-500 ease-(--ease-aura) group-hover:scale-100 group-hover:rotate-0 group-hover:opacity-100 lg:block"
                >
                  <Image src={row.lead.images.studio} alt="" fill sizes="176px" className="object-cover" />
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
