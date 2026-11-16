import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/product-card";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductPurchase } from "@/components/product/product-purchase";
import { getCategory } from "@/data/categories";
import { getProduct, getRelated, products } from "@/data/products";
import { routines } from "@/data/routines";
import { formatPrice } from "@/lib/format";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/produtos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Produto não encontrado" };
  const title = `${product.name}, ${product.kind.toLowerCase()}`;
  return {
    title,
    description: `AURA ${product.name}: ${product.summary}`,
    alternates: { canonical: `/produtos/${product.slug}` },
    openGraph: {
      title: `AURA ${title}`,
      description: product.summary,
      url: `/produtos/${product.slug}`,
      images: [{ url: product.images.studio.src, width: product.images.studio.width, height: product.images.studio.height, alt: product.imageAlt.studio }],
    },
  };
}

/**
 * Os parâmetros são resolvidos fora de <Suspense> de propósito: assim um slug
 * inexistente responde com status 404 real. As cinco páginas são pré-renderizadas
 * (generateStaticParams) e os dados são locais, então a navegação não espera rede.
 */
export const instant = false;

export default async function ProductPage({ params }: PageProps<"/produtos/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const related = getRelated(product);
  const inRoutines = routines.flatMap((r) => {
    const index = r.steps.findIndex((s) => s.slug === product.slug);
    return index === -1 ? [] : [{ label: r.label, step: index + 1, total: r.steps.length, gesture: r.steps[index].gesture }];
  });

  const gallery = [
    { src: product.images.studio, alt: product.imageAlt.studio, label: "Embalagem em estúdio" },
    { src: product.images.texture, alt: product.imageAlt.texture, label: "Textura da fórmula" },
    { src: product.images.ritual, alt: product.imageAlt.ritual, label: "Produto sobre pedra" },
  ];

  return (
    <>
      <div className="shell pt-4 lg:pt-8">
        <nav aria-label="Trilha de navegação" className="mb-5 text-sm text-pedra lg:mb-8">
          <ol className="flex flex-wrap items-center gap-x-2">
            <li>
              <Link href="/" className="hover:text-tinta">
                Início
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/produtos" className="hover:text-tinta">
                Coleção
              </Link>
            </li>
            {category ? (
              <>
                <li aria-hidden>/</li>
                <li>
                  <Link href={`/produtos?categoria=${category.slug}`} className="hover:text-tinta">
                    {category.name}
                  </Link>
                </li>
              </>
            ) : null}
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-tinta">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <ProductGallery images={gallery} name={product.name} />
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <h1 className="font-display" translate="no">
                <span className="wordmark block text-base text-pedra">AURA</span>
                <span className="text-display-l mt-2 block">{product.name}</span>
              </h1>
              <p className="mt-3 text-[0.9375rem] text-pedra">
                {product.kind}, {product.size}
              </p>
              <p className="font-display text-display-s mt-6 italic">{product.tagline}</p>

              <p className="tabular font-display mt-8 text-[2rem] leading-none">{formatPrice(product.priceCents)}</p>
              <p className="mt-4 max-w-md text-tinta/80">{product.summary}</p>

              <div className="mt-8">
                <ProductPurchase product={product} />
              </div>
              <p className="mt-4 text-sm text-pedra">
                Loja demonstrativa: o produto vai para a sacola, mas nenhum pedido é processado.
              </p>

              {product.notice ? (
                <p className="mt-6 border-l-2 border-rose-tinta py-1 pl-4 text-sm text-tinta/85" role="note">
                  {product.notice}
                </p>
              ) : null}

              <div className="mt-10 border-t border-tinta/15">
                <details className="group border-b border-tinta/15" open>
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 text-[0.9375rem] font-medium [&::-webkit-details-marker]:hidden">
                    Descrição
                    <span aria-hidden className="text-xl leading-none transition-transform duration-300 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <div className="space-y-4 pb-6 text-tinta/80">
                    {product.description.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                </details>
                <details className="group border-b border-tinta/15">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 text-[0.9375rem] font-medium [&::-webkit-details-marker]:hidden">
                    Como usar
                    <span aria-hidden className="text-xl leading-none transition-transform duration-300 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <ol className="list-decimal space-y-2 pb-6 pl-5 text-tinta/80 marker:text-rose-tinta">
                    {product.howToUse.map((step) => (
                      <li key={step} className="pl-1">
                        {step}
                      </li>
                    ))}
                  </ol>
                </details>
                <details className="group border-b border-tinta/15">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 text-[0.9375rem] font-medium [&::-webkit-details-marker]:hidden">
                    Sensorial
                    <span aria-hidden className="text-xl leading-none transition-transform duration-300 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <dl className="grid grid-cols-3 gap-4 pb-6">
                    {product.sensorial.map((s) => (
                      <div key={s.label}>
                        <dt className="text-sm text-pedra">{s.label}</dt>
                        <dd className="mt-1 text-[0.9375rem]">{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                </details>
              </div>

              {inRoutines.length ? (
                <div className="mt-8 bg-linho p-5">
                  <p className="text-sm text-pedra">Na rotina AURA</p>
                  <ul className="mt-2 space-y-1 text-[0.9375rem]">
                    {inRoutines.map((r) => (
                      <li key={r.label}>
                        {r.label}: etapa {r.step} de {r.total}, <span className="italic">{r.gesture.toLowerCase()}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/#rotina" className="mt-3 inline-block text-sm underline decoration-current/30 underline-offset-4 hover:decoration-current">
                    Ver a rotina completa
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <section aria-labelledby="relacionados-title" className="shell pt-24 pb-24 lg:pt-36 lg:pb-36">
        <h2 id="relacionados-title" className="font-display text-display-m">
          Combina com {product.name}
        </h2>
        <ul className="mt-10 grid grid-cols-2 gap-x-3 gap-y-12 sm:gap-x-6 lg:mt-14 lg:grid-cols-3 lg:gap-x-8">
          {related.map((p, i) => (
            <li key={p.slug} className={i === 2 ? "hidden lg:block" : undefined}>
              <ProductCard product={p} sizes="(min-width: 1024px) 30vw, 48vw" />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
