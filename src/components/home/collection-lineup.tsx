"use client";

import { m } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * A linha completa lado a lado, em escala real entre si: todos os recortes
 * compartilham a mesma base, então o pote Restore aparece baixo e a bisnaga
 * Cleanse alta — como numa foto de família da marca.
 */
export function CollectionLineup() {
  return (
    <section aria-labelledby="colecao-title" className="pt-24 lg:pt-36">
      <div className="shell grid gap-6 lg:grid-cols-12 lg:items-end">
        <h2 id="colecao-title" className="font-display text-display-l lg:col-span-7">
          Uma linha.
          <br />
          Cinco gestos.
        </h2>
        <p className="text-lead max-w-[34rem] text-tinta/80 lg:col-span-5 lg:pb-3">
          Cada fórmula AURA ocupa um lugar preciso na rotina. Juntas, cobrem o essencial do cuidado diário, sem excessos e
          sem etapas que não fazem sentido para a sua pele.
        </p>
      </div>

      <div className="relative mt-14 lg:mt-20">
        {/* superfície onde a linha repousa */}
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-[42%] bg-calcario" />
        <div aria-hidden className="absolute inset-x-0 bottom-[42%] h-px bg-tinta/10" />

        <ul className="no-scrollbar shell relative flex snap-x snap-mandatory scroll-px-(--gutter) gap-2 overflow-x-auto pb-10 sm:gap-4 lg:grid lg:grid-cols-5 lg:gap-6 lg:overflow-visible lg:pb-14">
          {products.map((p, i) => (
            <m.li
              key={p.slug}
              className="w-[46vw] shrink-0 snap-start sm:w-[32vw] lg:w-auto"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 1, delay: i * 0.08, ease }}
            >
              <Link href={`/produtos/${p.slug}`} className="group block">
                <div className="relative aspect-2/3">
                  <div
                    aria-hidden
                    style={{ "--aura": p.aura } as React.CSSProperties}
                    className="aura-glow absolute top-[48%] left-1/2 aspect-square w-[95%] -translate-1/2 rounded-full opacity-0 transition-opacity duration-700 group-hover:opacity-80 group-focus-visible:opacity-80"
                  />
                  <Image
                    src={p.images.cutout}
                    alt={`AURA ${p.name}, ${p.kind.toLowerCase()}`}
                    fill
                    sizes="(min-width: 1024px) 18vw, (min-width: 640px) 32vw, 46vw"
                    className="object-contain transition-transform duration-700 ease-(--ease-aura) group-hover:-translate-y-2"
                  />
                </div>
                <div className="mt-3 lg:mt-5">
                  <span className="font-display block text-[1.6rem] leading-tight" translate="no">
                    {p.name}
                  </span>
                  <span className="block text-sm text-pedra">{p.kind}</span>
                </div>
              </Link>
            </m.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
