"use client";

import { AnimatePresence, m } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { TextLink } from "@/components/ui/button";
import { getProduct, type Moment } from "@/data/products";
import { cn, formatPrice } from "@/lib/format";

const needs = [
  { id: "limpeza", label: "Limpeza" },
  { id: "leveza", label: "Leveza" },
  { id: "conforto", label: "Conforto" },
  { id: "protecao", label: "Proteção" },
] as const;

type Need = (typeof needs)[number]["id"];

const moments: { id: Moment; label: string }[] = [
  { id: "manha", label: "Manhã" },
  { id: "noite", label: "Noite" },
];

/** Regras da recomendação: momento do dia + o que a pessoa procura. */
function recommend(moment: Moment, need: Need): { slug: string; reason: string } {
  switch (need) {
    case "limpeza":
      return {
        slug: "cleanse",
        reason:
          moment === "manha"
            ? "Pela manhã, um gel que vira espuma leve prepara a pele sem pesar para as próximas etapas."
            : "À noite, Cleanse retira o dia com calma e abre espaço para o ritual noturno.",
      };
    case "leveza":
      return {
        slug: "hydrate",
        reason: "Algumas gotas de um sérum fluido, quase aquoso. A camada mais leve da linha, para qualquer hora do dia.",
      };
    case "conforto":
      return moment === "manha"
        ? { slug: "balance", reason: "Um creme leve e sedoso, que conforta sem deixar sensação de peso durante o dia." }
        : { slug: "restore", reason: "Uma textura densa e envolvente, criada para ser o último gesto antes de dormir." };
    case "protecao":
      return moment === "manha"
        ? { slug: "protect", reason: "Protect conclui a manhã com um fluido de toque seco. Lembre-se: é um produto conceitual." }
        : {
            slug: "restore",
            reason: "Protect é um gesto da manhã. À noite, o último passo do ritual é Restore, que envolve a pele até o dia seguinte.",
          };
  }
}

function ChoiceGroup<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  options: readonly { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset>
      <legend className="text-[0.9375rem] text-tinta/80">{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o.id} className="relative">
            <input
              type="radio"
              name={name}
              value={o.id}
              checked={value === o.id}
              onChange={() => onChange(o.id)}
              className="peer sr-only"
            />
            <span
              className={cn(
                "inline-flex min-h-11 cursor-pointer items-center rounded-full border px-5 text-[0.9375rem] transition-colors duration-300 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-rose-tinta",
                value === o.id ? "border-cacau bg-cacau text-marfim" : "border-tinta/20 hover:border-tinta",
              )}
            >
              {o.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function Discovery() {
  const [moment, setMoment] = useState<Moment>("manha");
  const [need, setNeed] = useState<Need>("leveza");
  const result = recommend(moment, need);
  const product = getProduct(result.slug);
  if (!product) return null;

  return (
    <section
      id="descobrir"
      aria-labelledby="descobrir-title"
      className="relative isolate overflow-hidden py-24 lg:py-36"
      style={{ "--aura": product.aura } as React.CSSProperties}
    >
      <div
        aria-hidden
        className="aura-glow absolute top-1/2 right-[-20%] -z-10 aspect-square w-[90vw] max-w-[60rem] -translate-y-1/2 rounded-full opacity-60 transition-[background] duration-700 lg:right-[-8%]"
      />
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <h2 id="descobrir-title" className="font-display text-display-l">
            Encontre seu cuidado
          </h2>
          <p className="text-lead mt-5 max-w-md text-tinta/80">
            Duas escolhas rápidas. A sugestão muda na hora e você pode levar o produto direto para a sacola.
          </p>
          <div className="mt-10 space-y-8">
            <ChoiceGroup legend="Para quando?" name="momento" options={moments} value={moment} onChange={setMoment} />
            <ChoiceGroup legend="O que você procura?" name="necessidade" options={needs} value={need} onChange={setNeed} />
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <m.article
              key={`${product.slug}-${moment}-${need}`}
              className="grid gap-6 bg-alabastro/70 p-5 backdrop-blur-sm sm:grid-cols-[minmax(0,13rem)_1fr] sm:p-6"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative aspect-4/5 overflow-hidden bg-calcario">
                <Image src={product.images.studio} alt={product.imageAlt.studio} fill sizes="(min-width: 640px) 208px, 90vw" className="object-cover" />
              </div>
              <div className="flex flex-col">
                <p className="text-sm text-pedra">Nossa sugestão</p>
                <h3 className="font-display mt-2 text-[2.4rem] leading-none">AURA {product.name}</h3>
                <p className="mt-1 text-sm text-pedra">
                  {product.kind}, {product.size}
                </p>
                <p className="mt-5 text-[0.9375rem] text-tinta/85">{result.reason}</p>
                <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-4 pt-6">
                  <AddToCartButton slugs={product.slug} ariaLabel={`Adicionar AURA ${product.name} à sacola`}>
                    Adicionar, {formatPrice(product.priceCents)}
                  </AddToCartButton>
                  <TextLink href={`/produtos/${product.slug}`}>Ver detalhes</TextLink>
                </div>
              </div>
            </m.article>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
