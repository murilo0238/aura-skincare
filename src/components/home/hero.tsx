"use client";

import { m } from "motion/react";
import Image from "next/image";
import { ButtonLink, TextLink } from "@/components/ui/button";
import { productImages } from "@/data/product-images";

const ease = [0.22, 1, 0.36, 1] as const;

/** Linha de título revelada de baixo para cima, dentro de uma máscara. */
function Line({ children, delay, className }: { children: React.ReactNode; delay: number; className?: string }) {
  return (
    <span className={`block overflow-hidden pb-[0.08em] ${className ?? ""}`}>
      <m.span
        className="block"
        initial={{ y: "108%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1.1, delay, ease }}
      >
        {children}
      </m.span>
    </span>
  );
}

/**
 * Hero: o slogan se divide em volta do frasco Hydrate, que emana sua aura.
 * A primeira linha passa por trás do frasco; a segunda, pela frente.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <div className="shell relative flex flex-col pt-6 pb-12 lg:h-[clamp(40rem,calc(100svh-var(--header-h)),60rem)] lg:pt-0 lg:pb-0">
        <h1 id="hero-title" className="font-display text-display-xl text-tinta">
          <Line delay={0.15} className="absolute top-6 left-(--gutter) z-0 lg:top-[9%]">
            Sua essência,
          </Line>
          <Line
            delay={0.32}
            className="relative z-20 -mt-[0.35em] text-right italic lg:absolute lg:right-(--gutter) lg:bottom-[24%] lg:mt-0"
          >
            em cada cuidado.
          </Line>
        </h1>

        {/* frasco + aura: no mobile fica entre as duas linhas (a primeira é posicionada no topo) */}
        <div className="relative z-10 order-first mx-auto mt-10 -mb-6 aspect-2/3 h-[min(56svh,30rem)] max-w-full sm:h-[min(60svh,34rem)] lg:absolute lg:bottom-[7%] lg:left-1/2 lg:order-none lg:m-0 lg:h-[78%] lg:-translate-x-1/2">
          <m.div
            aria-hidden
            className="absolute top-[34%] left-1/2 -z-10 aspect-square w-[170%] -translate-x-1/2 -translate-y-1/2 lg:w-[190%]"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2.2, delay: 0.1, ease }}
          >
            <div className="aura-glow aura-breathe size-full rounded-full [--aura:#dc9e8f]" />
          </m.div>
          <m.div
            className="relative size-full"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, delay: 0.25, ease }}
          >
            <Image
              src={productImages.hydrate.cutout}
              alt="Frasco conta-gotas AURA Hydrate em vidro rosé fosco com tampa cacau."
              fill
              preload
              loading="eager"
              sizes="(min-width: 1024px) 34vh, 60vw"
              className="object-contain"
            />
          </m.div>
        </div>

        {/* rodapé do hero */}
        <m.div
          className="relative z-20 mt-10 flex flex-col gap-8 lg:absolute lg:inset-x-(--gutter) lg:bottom-10 lg:mt-0 lg:flex-row lg:items-end lg:justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.75 }}
        >
          <div className="max-w-[23rem]">
            <p className="text-lead text-tinta/85">
              Cinco fórmulas essenciais, pensadas como um único ritual: da limpeza da manhã ao último gesto da noite.
            </p>
            <ButtonLink href="/produtos" className="mt-6 w-full sm:w-auto">
              Explorar a coleção
            </ButtonLink>
          </div>
          <p className="text-sm text-pedra lg:max-w-[15rem] lg:text-right">
            Na imagem: AURA Hydrate, sérum hidratante em frasco de vidro rosé.{" "}
            <TextLink href="/produtos/hydrate" className="mt-1 text-sm text-tinta">
              Ver o sérum
            </TextLink>
          </p>
        </m.div>
      </div>
    </section>
  );
}
