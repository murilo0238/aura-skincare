import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink, TextLink } from "@/components/ui/button";
import { productImages } from "@/data/product-images";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="shell relative isolate grid min-h-[70svh] items-center gap-10 py-16 lg:grid-cols-12">
      <div className="lg:col-span-6">
        <p className="text-sm text-pedra">Erro 404</p>
        <h1 className="font-display text-display-l mt-3">Esta página não existe.</h1>
        <p className="text-lead mt-6 max-w-md text-tinta/80">
          O endereço pode ter mudado ou sido digitado com algum erro. A coleção continua no mesmo lugar.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
          <ButtonLink href="/produtos">Ver a coleção</ButtonLink>
          <TextLink href="/">Voltar ao início</TextLink>
        </div>
      </div>
      <div className="relative mx-auto aspect-2/3 w-56 lg:col-span-4 lg:col-start-9 lg:w-full lg:max-w-xs">
        <div aria-hidden className="aura-glow absolute top-1/2 left-1/2 -z-10 aspect-square w-[150%] -translate-1/2 rounded-full opacity-60 [--aura:#b3b29d]" />
        <Image src={productImages.cleanse.cutout} alt="" fill sizes="(min-width: 1024px) 20rem, 14rem" className="object-contain" />
      </div>
    </section>
  );
}
