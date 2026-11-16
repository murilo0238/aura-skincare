/**
 * Mapa de imagens dos produtos.
 *
 * Os arquivos atuais são RENDERS ILUSTRATIVOS gerados por `npm run assets`
 * (scripts/generate-assets.mjs) — substitutos de fotografia de estúdio.
 * Para usar fotos reais, troque os arquivos em src/assets/products mantendo
 * nome e proporção (4:5 para studio/ritual/texture; 2:3 com fundo
 * transparente para cutout). Nenhum código precisa mudar.
 */
import type { StaticImageData } from "next/image";

import cleanseCutout from "@/assets/products/cleanse-cutout.webp";
import cleanseStudio from "@/assets/products/cleanse-studio.webp";
import cleanseRitual from "@/assets/products/cleanse-ritual.webp";
import cleanseTexture from "@/assets/products/cleanse-texture.webp";
import hydrateCutout from "@/assets/products/hydrate-cutout.webp";
import hydrateStudio from "@/assets/products/hydrate-studio.webp";
import hydrateRitual from "@/assets/products/hydrate-ritual.webp";
import hydrateTexture from "@/assets/products/hydrate-texture.webp";
import balanceCutout from "@/assets/products/balance-cutout.webp";
import balanceStudio from "@/assets/products/balance-studio.webp";
import balanceRitual from "@/assets/products/balance-ritual.webp";
import balanceTexture from "@/assets/products/balance-texture.webp";
import restoreCutout from "@/assets/products/restore-cutout.webp";
import restoreStudio from "@/assets/products/restore-studio.webp";
import restoreRitual from "@/assets/products/restore-ritual.webp";
import restoreTexture from "@/assets/products/restore-texture.webp";
import protectCutout from "@/assets/products/protect-cutout.webp";
import protectStudio from "@/assets/products/protect-studio.webp";
import protectRitual from "@/assets/products/protect-ritual.webp";
import protectTexture from "@/assets/products/protect-texture.webp";

export interface ProductImageSet {
  /** Produto isolado, fundo transparente (2:3). */
  cutout: StaticImageData;
  /** Estúdio, fundo neutro com a aura da fórmula (4:5). */
  studio: StaticImageData;
  /** Produto sobre pedra, luz lateral (4:5). */
  ritual: StaticImageData;
  /** Textura da fórmula em close (4:5). */
  texture: StaticImageData;
}

export const productImages = {
  cleanse: { cutout: cleanseCutout, studio: cleanseStudio, ritual: cleanseRitual, texture: cleanseTexture },
  hydrate: { cutout: hydrateCutout, studio: hydrateStudio, ritual: hydrateRitual, texture: hydrateTexture },
  balance: { cutout: balanceCutout, studio: balanceStudio, ritual: balanceRitual, texture: balanceTexture },
  restore: { cutout: restoreCutout, studio: restoreStudio, ritual: restoreRitual, texture: restoreTexture },
  protect: { cutout: protectCutout, studio: protectStudio, ritual: protectRitual, texture: protectTexture },
} satisfies Record<string, ProductImageSet>;

export type ImageKey = keyof typeof productImages;
