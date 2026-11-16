import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import type { Product } from "@/data/products";
import { cn, formatPrice } from "@/lib/format";

interface ProductCardProps {
  product: Product;
  sizes?: string;
  className?: string;
  /** Nível do título do card, conforme a hierarquia da página. */
  headingLevel?: "h2" | "h3";
  preload?: boolean;
}

/**
 * Card de produto. A imagem de estúdio dá lugar à textura da fórmula no hover;
 * em telas de toque, o botão de adicionar fica sempre visível.
 */
export function ProductCard({
  product,
  sizes = "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw",
  className,
  headingLevel: Heading = "h3",
  preload = false,
}: ProductCardProps) {
  const href = `/produtos/${product.slug}`;
  return (
    <article className={cn("group relative", className)}>
      <div className="relative overflow-hidden bg-calcario">
        <Link href={href} className="block aspect-4/5" tabIndex={-1} aria-hidden>
          <Image
            src={product.images.studio}
            alt=""
            fill
            sizes={sizes}
            preload={preload}
            placeholder="blur"
            className="object-cover transition-transform duration-[1.2s] ease-(--ease-aura) group-hover:scale-[1.035]"
          />
          <Image
            src={product.images.texture}
            alt=""
            fill
            sizes={sizes}
            className="object-cover opacity-0 transition-opacity duration-700 ease-(--ease-soft) [@media(hover:hover)]:group-hover:opacity-100"
          />
        </Link>
        <div className="absolute right-3 bottom-3 z-10 transition-[opacity,translate] duration-500 ease-(--ease-aura) [@media(hover:hover)]:translate-y-2 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-focus-within:translate-y-0 [@media(hover:hover)]:group-focus-within:opacity-100 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100">
          <AddToCartButton
            slugs={product.slug}
            variant="light"
            className="min-h-11 w-11 px-0 text-sm shadow-[0_10px_30px_-12px_rgb(32_27_25/0.45)] sm:w-auto sm:px-5"
            ariaLabel={`Adicionar AURA ${product.name} à sacola`}
            addedLabel={<span className="hidden sm:inline">Adicionado</span>}
          >
            <Plus className="size-4 sm:hidden" strokeWidth={1.6} aria-hidden />
            <span className="hidden sm:inline">Adicionar</span>
          </AddToCartButton>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <Heading className="font-display text-[1.7rem] leading-[1.05]">
            <Link href={href} className="decoration-1 underline-offset-4 hover:underline" translate="no">
              <span className="sr-only">AURA </span>
              {product.name}
            </Link>
          </Heading>
          <p className="mt-1 text-sm text-pedra">
            {product.kind}, {product.size}
          </p>
        </div>
        <p className="tabular text-[0.9375rem] sm:pt-1.5">
          {formatPrice(product.priceCents)}
        </p>
      </div>
    </article>
  );
}
