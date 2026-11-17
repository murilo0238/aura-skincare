import type { NextConfig } from "next";

/**
 * AURA_EXPORT=1 gera um site estático em `out/` (usado na demo hospedada em
 * aura.garrastudios.online, servida por Nginx sem Node). Sem a variável, o build
 * é o padrão do Next.js com servidor.
 */
const isStaticExport = process.env.AURA_EXPORT === "1";

// Cache Components fica desligado: todas as rotas são estáticas e os dados são locais,
// e o PPR que ele ativa não é compatível com `output: "export"` (usado na demo).
const nextConfig: NextConfig = {
  ...(isStaticExport ? { output: "export" as const, trailingSlash: true } : {}),
  images: {
    qualities: [75, 85],
    // Sem servidor não há otimização sob demanda; os WebP originais já são leves (≤ 70 KB).
    unoptimized: isStaticExport,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
