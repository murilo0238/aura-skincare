# AURA — Skincare & Beauty

E-commerce conceitual de skincare criado pela Garra Studios para portfólio.
**Marca, produtos, preços, fretes e pedidos são fictícios.** Não há backend de pedidos nem pagamento.

> Leia também `AGENTS.md`: o Next.js 16 tem APIs diferentes das versões anteriores. Consulte
> `node_modules/next/dist/docs/` antes de usar uma API do framework de que não tenha certeza.

## Comandos

```bash
npm run dev        # desenvolvimento
npm run build      # build de produção (também roda o TypeScript)
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm run assets     # regenera os renders de produto (scripts/generate-assets.mjs)
npm run assets -- editorial   # só as imagens editoriais, OG e ícone
```

Defina `NEXT_PUBLIC_SITE_URL` no deploy (usada em metadata, sitemap e robots).

## Stack

Next.js 16 (App Router, Turbopack, `cacheComponents` + `partialPrefetching`), React 19, TypeScript,
Tailwind CSS 4 (tokens em `@theme`, sem `tailwind.config`), Motion (`motion/react` com `LazyMotion` +
`m.*`), Zustand (carrinho), Lucide, next/image, next/font.

## Estrutura

```
src/app/            rotas: / · /produtos · /produtos/[slug] · /checkout · 404 · error · sitemap · robots · icon
src/components/
  layout/           header, footer, menu mobile, busca
  cart/             carrinho lateral, botão de adicionar, seletor de quantidade
  product/          card, galeria, bloco de compra
  catalog/          catálogo com filtros na URL
  checkout/         formulário, resumo, campos
  home/             uma seção por arquivo
  ui/               botões (variantes explícitas)
src/data/           produtos, categorias, rotinas, frete e mapa de imagens — tudo tipado
src/lib/            formatação (Intl), filtros do catálogo, validação do checkout, URL do site
src/store/          cart.ts (Zustand + localStorage), ui.ts (painel aberto)
src/hooks/          use-dialog-behavior (foco preso, Esc, scroll lock, devolução de foco)
src/assets/         renders gerados (produtos e editorial)
scripts/            gerador de renders e prancha de contato
```

## Decisões de arquitetura

- **Dados locais e tipados.** `src/data/products.ts` é a fonte única. Para adicionar um produto:
  inclua o objeto, gere as imagens e registre-as em `product-images.ts`.
- **Carrinho sem erro de hidratação.** O `persist` do Zustand usa `skipHydration: true`; a leitura do
  localStorage acontece em `CartPersistence` (providers.tsx) depois da hidratação. Contadores e totais
  só aparecem quando `useCartHydrated()` é verdadeiro. A chave é versionada (`aura:cart`, `version: 1`),
  guarda só `slug` + `quantidade`, é sanitizada ao ler e sincroniza entre abas pelo evento `storage`.
- **Nenhum dado pessoal persiste.** O checkout mantém o formulário só em estado React, descarta os
  dados ao confirmar e ao sair da rota (cleanup do `useLayoutEffect`, já que o Next 16 preserva rotas
  ocultas com `<Activity>`). A newsletter não envia nem guarda e-mail.
- **Filtros na URL.** `?categoria=&preco=&ordem=&busca=` são validados em `lib/catalog.ts`; valores
  inválidos são ignorados. O catálogo usa `useSearchParams` dentro de `<Suspense>` (exigência do Cache Components).
- **Página de produto com 404 real.** `params` é resolvido fora de `<Suspense>` para que slugs
  inexistentes respondam 404; por isso a rota exporta `instant = false` (só desliga a validação de
  navegação instantânea do dev). As cinco páginas são pré-renderizadas por `generateStaticParams`.
  `dynamicParams` não existe com Cache Components.
- **Composição.** Variantes explícitas (`Button variant="solid|outline|light"`), sem props booleanas
  de modo; estado compartilhado em stores, não em prop drilling; uma seção da Home por componente.
- **Bundle.** Importações diretas (sem barrel files), `LazyMotion` com `domAnimation`, imagens estáticas
  importadas (dimensões e blur automáticos).

## Design system

**Conceito:** "aura" como luz que emana. Cada fórmula tem a sua cor de halo, e esse halo é o elemento
memorável da marca (hero, cards, linha de produtos, descoberta). O resto fica quieto e disciplinado.

| Token | Hex | Uso |
| --- | --- | --- |
| alabastro | `#ece6e0` | fundo base (marfim levemente rosado, não o creme genérico) |
| linho | `#f6f2ee` | superfícies claras, campos |
| calcário | `#d8cdc1` | bege mineral, superfícies e bases |
| rosé | `#b4877b` / rosé-tinta `#87554a` | aura decorativa / texto em rosé (≥ 4,9:1) |
| cacau | `#3a2520` | blocos profundos, botões, rodapé |
| tinta | `#201b19` | texto (13,8:1) |
| pedra | `#62544e` | texto secundário (≥ 5,1:1 em todas as superfícies) |

Auras por produto: Cleanse `#b3b29d` (mineral) · Hydrate `#d9a092` (rosé) · Balance `#d3b07c` (areia) ·
Restore `#8d5862` (ameixa, paleta invertida: produto da noite) · Protect `#e3a971` (damasco).

**Tipografia:** Bodoni Moda (eixo óptico, títulos em escala grande, itálico só em frases inteiras) +
Jost (interface e texto). Escala em utilitários: `text-display-xl/l/m/s`, `text-lead`. O logotipo é
tipográfico (`.wordmark`, tracking 0,34em). Valores com `tabular`.

**Forma:** botões em pílula (min. 48px), imagens com cantos retos, campos com raio 8px. Sem sombras
genéricas em cards; sombra só em elementos flutuantes (botão sobre imagem, gaveta).

**Movimento:** um momento orquestrado no hero (máscara do título, frasco sobe, aura acende e respira
uma vez); revelações pontuais (linha de produtos, imagem da Filosofia); o restante responde a ações
(gaveta, menu, adicionar, troca de abas). Anima só `transform`/`opacity`. `MotionConfig reducedMotion="user"`
+ media query desligam animações.

**Texto:** português, caixa de sentença, voz ativa, sem rótulos em caixa alta, sem "→" em botões.
Botões dizem exatamente o que fazem ("Adicionar à sacola", "Finalizar pedido demonstrativo").

## Regras de conteúdo (obrigatórias)

- Não inventar ingredientes, certificações, avaliações, FPS ou alegações clínicas. Só sensorial e modo de uso.
- Protect sempre com o aviso de produto conceitual sem fator de proteção definido.
- Nada de dados estruturados de Product/Offer/Review (o projeto é demonstrativo).
- Avisos de demonstração visíveis: rodapé, página de produto, gaveta (frete), checkout, newsletter.
- Rodapé: "Projeto conceitual desenvolvido por Garra Studios." com link para https://garrastudios.online.
  Não misturar a identidade visual da Garra com a da AURA.

## Imagens

Todas as imagens são **renders ilustrativos** gerados por `scripts/generate-assets.mjs` (SVG com texto
convertido em contornos via opentype.js → WebP via sharp). Não são fotografias e são declaradas como tal
no rodapé. Para usar fotos reais, substitua os arquivos em `src/assets/products` com o mesmo nome e
proporção (4:5 para `studio`/`ritual`/`texture`, 2:3 com fundo transparente para `cutout`).

## Critérios de qualidade

Antes de considerar uma mudança pronta: `npm run lint`, `npm run typecheck` e `npm run build` sem
erros; sem overflow horizontal em 375px; foco visível em todo elemento interativo; diálogos com foco
preso, Esc e devolução de foco; contraste AA; `prefers-reduced-motion` respeitado; nenhum aviso de
hidratação no console.

## Limitações conhecidas

- Sem backend: pedidos, frete e newsletter são simulados. CEP não é consultado.
- Sem testes automatizados no repositório; os fluxos foram verificados com scripts no Chrome headless.
- Renders ilustrativos no lugar de fotografia de produto.
- Navegações do cliente para `/produtos/[slug]` não usam o App Shell instantâneo (ver decisão acima).
