/**
 * Catálogo demonstrativo da AURA.
 *
 * Marca, produtos e preços são fictícios. Os textos descrevem apenas
 * sensorial e modo de uso: não há ingredientes, certificações, avaliações,
 * fator de proteção ou alegações clínicas — e não deve haver.
 *
 * Para adicionar um produto: inclua um objeto em `products`, gere/adicione as
 * imagens em src/assets/products e registre-as em product-images.ts.
 */
import type { CategorySlug } from "./categories";
import { productImages, type ImageKey, type ProductImageSet } from "./product-images";

export type Moment = "manha" | "noite";

export interface Product {
  slug: string;
  name: string;
  /** Tipo de produto, como aparece na embalagem. */
  kind: string;
  category: CategorySlug;
  /** Preço em centavos (BRL). */
  priceCents: number;
  size: string;
  tagline: string;
  summary: string;
  description: string[];
  howToUse: string[];
  sensorial: { label: string; value: string }[];
  moments: Moment[];
  /** Cor da aura da fórmula — usada em halos e fundos. */
  aura: string;
  /** Observação obrigatória exibida na página do produto, quando houver. */
  notice?: string;
  images: ProductImageSet;
  imageAlt: { studio: string; ritual: string; texture: string };
}

type ProductInput = Omit<Product, "images"> & { slug: ImageKey };

const catalog: ProductInput[] = [
  {
    slug: "cleanse",
    name: "Cleanse",
    kind: "Gel de limpeza facial",
    category: "limpeza",
    priceCents: 12900,
    size: "150 ml",
    tagline: "O primeiro gesto do ritual.",
    summary: "Gel translúcido que se desfaz em uma espuma leve ao contato com a água.",
    description: [
      "Cleanse abre o ritual AURA. A textura em gel desliza sobre a pele úmida e se transforma em uma espuma delicada, que sai com facilidade no enxágue.",
      "Foi pensado para o começo e o fim do dia: um gesto curto, sem pressa, que prepara a pele para as próximas etapas.",
    ],
    howToUse: [
      "Umedeça o rosto com água morna.",
      "Massageie uma pequena quantidade com movimentos circulares por cerca de trinta segundos.",
      "Enxágue e seque com toques leves, sem friccionar.",
    ],
    sensorial: [
      { label: "Textura", value: "Gel translúcido" },
      { label: "Sensação", value: "Fresca, sem repuxar" },
      { label: "Momento", value: "Manhã e noite" },
    ],
    moments: ["manha", "noite"],
    aura: "#b3b29d",
    imageAlt: {
      studio: "Bisnaga AURA Cleanse em tom argila com tampa cacau, de pé sobre fundo mineral claro com halo esverdeado suave.",
      ritual: "Bisnaga AURA Cleanse apoiada sobre uma laje de pedra, com luz lateral e sombra longa.",
      texture: "Close da textura em gel translúcido do Cleanse, com pequenas bolhas de ar.",
    },
  },
  {
    slug: "hydrate",
    name: "Hydrate",
    kind: "Sérum hidratante",
    category: "tratamento",
    priceCents: 21900,
    size: "30 ml",
    tagline: "Uma gota de luz.",
    summary: "Sérum fluido de toque aquoso, aplicado em gotas logo após a limpeza.",
    description: [
      "Hydrate é a camada mais leve do ritual. O conta-gotas libera a quantidade certa de um sérum fluido, quase aquoso, que se espalha com dois ou três toques.",
      "O frasco em vidro rosé fosco guarda a fórmula longe da luz direta e se tornou o símbolo da linha.",
    ],
    howToUse: [
      "Após a limpeza, aplique de três a quatro gotas na palma das mãos.",
      "Pressione suavemente sobre rosto e pescoço, sem esfregar.",
      "Aguarde alguns instantes antes do hidratante.",
    ],
    sensorial: [
      { label: "Textura", value: "Fluida, quase aquosa" },
      { label: "Acabamento", value: "Leve, sem película" },
      { label: "Momento", value: "Manhã e noite" },
    ],
    moments: ["manha", "noite"],
    aura: "#d9a092",
    imageAlt: {
      studio: "Frasco conta-gotas AURA Hydrate em vidro rosé fosco, sobre fundo claro com halo rosado.",
      ritual: "Frasco AURA Hydrate sobre uma laje de pedra, iluminado por luz lateral suave em fundo rosé.",
      texture: "Gotas do sérum Hydrate espalhadas sobre uma superfície rosé.",
    },
  },
  {
    slug: "balance",
    name: "Balance",
    kind: "Hidratante facial",
    category: "hidratacao",
    priceCents: 18900,
    size: "50 ml",
    tagline: "O meio-termo exato.",
    summary: "Creme leve de textura sedosa, entre o conforto e a leveza.",
    description: [
      "Balance é o hidratante de todos os dias. A textura cremosa se espalha com facilidade e deixa um toque sedoso, sem sensação de peso.",
      "A embalagem com válvula pump dosa a quantidade certa e protege a fórmula do contato com o ar.",
    ],
    howToUse: [
      "Pressione a válvula uma ou duas vezes.",
      "Distribua em pontos pelo rosto e espalhe de dentro para fora.",
      "Pela manhã, finalize com Protect.",
    ],
    sensorial: [
      { label: "Textura", value: "Creme leve" },
      { label: "Acabamento", value: "Sedoso" },
      { label: "Momento", value: "Manhã" },
    ],
    moments: ["manha"],
    aura: "#d3b07c",
    imageAlt: {
      studio: "Frasco pump AURA Balance em tom areia com válvula cacau, sobre fundo claro com halo dourado.",
      ritual: "Frasco AURA Balance de pé sobre uma laje de pedra em fundo areia.",
      texture: "Espiral do creme Balance, cremoso e brilhante, sobre fundo areia.",
    },
  },
  {
    slug: "restore",
    name: "Restore",
    kind: "Creme noturno",
    category: "hidratacao",
    priceCents: 24900,
    size: "50 g",
    tagline: "Para as horas de silêncio.",
    summary: "Creme denso e envolvente, criado para o último gesto da noite.",
    description: [
      "Restore inverte a paleta da linha: o pote em vidro cacau marca o fim do dia. A textura é rica e se aquece entre os dedos antes de tocar a pele.",
      "Uma pequena quantidade basta. O ritual da noite pede menos produtos e mais tempo.",
    ],
    howToUse: [
      "À noite, após Cleanse e Hydrate, retire uma pequena porção com a ponta dos dedos.",
      "Aqueça entre as mãos por alguns segundos.",
      "Pressione sobre o rosto com movimentos lentos, de baixo para cima.",
    ],
    sensorial: [
      { label: "Textura", value: "Bálsamo cremoso" },
      { label: "Acabamento", value: "Envolvente" },
      { label: "Momento", value: "Noite" },
    ],
    moments: ["noite"],
    aura: "#8d5862",
    imageAlt: {
      studio: "Pote AURA Restore em vidro cacau com tampa clara, sobre fundo escuro com halo ameixa.",
      ritual: "Pote AURA Restore sobre uma laje de pedra em ambiente escuro e quente.",
      texture: "Espiral do creme Restore, denso e claro, sobre fundo ameixa escuro.",
    },
  },
  {
    slug: "protect",
    name: "Protect",
    kind: "Proteção diária",
    category: "protecao",
    priceCents: 15900,
    size: "50 ml",
    tagline: "O gesto que encerra a manhã.",
    summary: "Conceito de fluido de toque seco que conclui a rotina do dia.",
    description: [
      "Protect fecha o ritual da manhã com um fluido leve, de toque seco, que se espalha rapidamente sob a maquiagem ou sozinho.",
      "Como toda a linha AURA, Protect é um conceito de produto criado para esta demonstração.",
    ],
    howToUse: [
      "Pela manhã, como última etapa da rotina.",
      "Aplique uma quantidade generosa sobre rosto e pescoço.",
      "Espalhe com toques leves até uniformizar.",
    ],
    sensorial: [
      { label: "Textura", value: "Fluido leve" },
      { label: "Acabamento", value: "Toque seco" },
      { label: "Momento", value: "Manhã" },
    ],
    moments: ["manha"],
    aura: "#e3a971",
    notice:
      "Produto conceitual: Protect não possui fator de proteção solar definido nem testado e não substitui um protetor solar real.",
    imageAlt: {
      studio: "Frasco AURA Protect em tom âmbar claro com tampa cacau, sobre fundo claro com halo damasco.",
      ritual: "Frasco AURA Protect sobre uma laje de pedra, com luz quente de manhã.",
      texture: "Pincelada do fluido Protect sobre fundo damasco.",
    },
  },
];

export const products: Product[] = catalog.map((p) => ({ ...p, images: productImages[p.slug] }));

const bySlug = new Map(products.map((p) => [p.slug, p]));

export function getProduct(slug: string): Product | undefined {
  return bySlug.get(slug);
}

export function getProductsBySlugs(slugs: readonly string[]): Product[] {
  return slugs.flatMap((s) => {
    const p = bySlug.get(s);
    return p ? [p] : [];
  });
}

/** Relacionados: mesmo momento do dia primeiro, depois o restante da linha. */
export function getRelated(product: Product, limit = 3): Product[] {
  const score = (p: Product) => p.moments.filter((m) => product.moments.includes(m)).length;
  return products
    .filter((p) => p.slug !== product.slug)
    .toSorted((a, b) => score(b) - score(a))
    .slice(0, limit);
}
