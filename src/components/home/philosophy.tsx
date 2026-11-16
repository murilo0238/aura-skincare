"use client";

import { m } from "motion/react";
import Image from "next/image";
import ritualSet from "@/assets/editorial/ritual-set.webp";

const principles = [
  {
    title: "Menos etapas",
    text: "Cinco fórmulas cobrem o essencial. Cada uma existe porque ocupa um lugar que nenhuma outra ocupa.",
  },
  {
    title: "Texturas que pedem pausa",
    text: "Gel, gota, creme e bálsamo foram pensados para serem sentidos. O cuidado começa pelo toque.",
  },
  {
    title: "Uma linguagem só",
    text: "Mesma tipografia, mesmos materiais, a mesma luz. Na prateleira, a linha se reconhece de longe.",
  },
];

export function Philosophy() {
  return (
    <section id="filosofia" aria-labelledby="filosofia-title" className="on-dark mt-24 bg-cacau text-marfim lg:mt-36">
      <div className="shell py-24 lg:py-36">
        <h2 id="filosofia-title" className="sr-only">
          Filosofia da marca
        </h2>
        <p className="font-display text-display-l max-w-[18ch] text-marfim">
          Acreditamos em poucos produtos, usados com atenção.
        </p>

        <div className="mt-16 grid gap-14 lg:mt-24 lg:grid-cols-12 lg:gap-8">
          <figure className="lg:col-span-5">
            <div className="relative aspect-4/5 overflow-hidden">
              {/* revelação com transform (compositor), não clip-path */}
              <m.div
                className="absolute inset-0"
                initial={{ y: "14%", scale: 1.08 }}
                whileInView={{ y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              >
              <Image
                src={ritualSet}
                alt="Pote AURA Restore à frente do frasco Hydrate e da bisnaga Cleanse, sobre uma laje de pedra clara com luz rosada ao fundo."
                fill
                sizes="(min-width: 1024px) 38vw, 92vw"
                placeholder="blur"
                className="object-cover"
              />
              </m.div>
            </div>
            <figcaption className="mt-3 text-sm text-marfim/60">Restore, Hydrate e Cleanse: o ritual da noite em três gestos.</figcaption>
          </figure>

          <div className="lg:col-span-6 lg:col-start-7 lg:pt-10">
            <p className="text-lead max-w-[36rem] text-marfim/80">
              AURA nasceu da ideia de que o autocuidado não precisa ser uma lista longa. Precisa de constância, de bons
              materiais e de alguns minutos só seus, de manhã e à noite.
            </p>
            <ul className="mt-12 border-t border-marfim/15">
              {principles.map((p) => (
                <li key={p.title} className="grid gap-2 border-b border-marfim/15 py-7 sm:grid-cols-[13rem_1fr] sm:gap-8">
                  <h3 className="font-display text-[1.6rem] leading-tight">{p.title}</h3>
                  <p className="text-marfim/70">{p.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
