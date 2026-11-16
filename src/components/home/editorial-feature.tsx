import Image from "next/image";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { TextLink } from "@/components/ui/button";
import { getProduct } from "@/data/products";
import { formatPrice } from "@/lib/format";

/** Página dupla de revista dedicada ao Restore, o produto da noite. */
export function EditorialFeature() {
  const p = getProduct("restore");
  if (!p) return null;
  return (
    <section
      aria-labelledby="restore-title"
      className="on-dark mt-24 bg-[linear-gradient(160deg,#3e2a26,#231715)] text-marfim lg:mt-36"
    >
      <div className="grid lg:grid-cols-2">
        <div className="relative">
          <div className="relative aspect-4/5 lg:sticky lg:top-0 lg:aspect-auto lg:h-full lg:min-h-[52rem]">
            <Image
              src={p.images.studio}
              alt={p.imageAlt.studio}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              placeholder="blur"
              className="object-cover"
            />
          </div>
        </div>

        <div className="shell flex flex-col justify-center py-20 lg:max-w-none lg:px-[clamp(3rem,7vw,8rem)] lg:py-28">
          <p className="text-sm text-marfim/60">O ritual da noite</p>
          <h2 id="restore-title" className="font-display text-display-xl mt-4" translate="no">
            Restore
          </h2>
          <p className="font-display text-display-s mt-5 text-marfim/90 italic">{p.tagline}</p>
          <p className="text-lead mt-8 max-w-[34rem] text-marfim/75">{p.description[0]}</p>

          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-marfim/15 pt-6">
            {p.sensorial.map((s) => (
              <div key={s.label}>
                <dt className="text-sm text-marfim/55">{s.label}</dt>
                <dd className="mt-1 text-[0.9375rem]">{s.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
            <AddToCartButton slugs={p.slug} variant="light" ariaLabel={`Adicionar AURA ${p.name} à sacola`}>
              Adicionar à sacola, {formatPrice(p.priceCents)}
            </AddToCartButton>
            <TextLink href={`/produtos/${p.slug}`} className="text-marfim">
              Conhecer o Restore
            </TextLink>
          </div>

          <div className="relative mt-16 hidden w-48 self-end lg:block">
            <div className="relative aspect-4/5 overflow-hidden">
              <Image src={p.images.texture} alt={p.imageAlt.texture} fill sizes="192px" className="object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
