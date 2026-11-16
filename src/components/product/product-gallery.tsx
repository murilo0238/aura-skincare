"use client";

import { AnimatePresence, m } from "motion/react";
import Image, { type StaticImageData } from "next/image";
import { useRef, useState } from "react";
import { cn } from "@/lib/format";

export interface GalleryImage {
  src: StaticImageData;
  alt: string;
  label: string;
}

/**
 * Desktop: imagem principal + miniaturas verticais.
 * Mobile: carrossel com rolagem horizontal nativa (scroll-snap) e indicadores.
 */
export function ProductGallery({ images, name }: { images: GalleryImage[]; name: string }) {
  const [active, setActive] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  function onScroll() {
    const el = trackRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== mobileIndex) setMobileIndex(i);
  }

  function goTo(i: number) {
    const el = trackRef.current;
    el?.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  }

  return (
    <div>
      {/* mobile */}
      <div className="lg:hidden">
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="no-scrollbar -mx-(--gutter) flex snap-x snap-mandatory overflow-x-auto"
          aria-label={`Imagens de AURA ${name}`}
          role="region"
          tabIndex={0}
        >
          {images.map((img, i) => (
            <div key={img.label} className="relative aspect-4/5 w-full shrink-0 snap-center bg-calcario">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="100vw"
                preload={i === 0}
                loading={i === 0 ? "eager" : "lazy"}
                placeholder="blur"
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center gap-1">
          {images.map((img, i) => (
            <button
              key={img.label}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ver imagem ${i + 1} de ${images.length}: ${img.label}`}
              aria-current={i === mobileIndex}
              className="inline-flex size-8 items-center justify-center"
            >
              <span className={cn("block h-1 w-6 rounded-full transition-[scale,background-color] duration-500", i === mobileIndex ? "scale-x-100 bg-cacau" : "scale-x-25 bg-tinta/25")} />
            </button>
          ))}
        </div>
      </div>

      {/* desktop */}
      <div className="hidden gap-5 lg:grid lg:grid-cols-[5.5rem_1fr]">
        <ul className="space-y-3" aria-label="Escolher imagem">
          {images.map((img, i) => (
            <li key={img.label}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                aria-label={`Mostrar ${img.label.toLowerCase()}`}
                className={cn(
                  "relative block aspect-4/5 w-full overflow-hidden bg-calcario transition-opacity duration-300",
                  i === active ? "opacity-100 ring-1 ring-tinta ring-offset-4 ring-offset-alabastro" : "opacity-60 hover:opacity-100",
                )}
              >
                <Image src={img.src} alt="" fill sizes="88px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
        <div className="relative aspect-4/5 overflow-hidden bg-calcario">
          <AnimatePresence initial={false}>
            <m.div
              key={active}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={images[active].src}
                alt={images[active].alt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                preload={active === 0}
                loading="eager"
                placeholder="blur"
                className="object-cover"
              />
            </m.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
