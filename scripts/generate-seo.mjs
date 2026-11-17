/**
 * Gera public/robots.txt e public/sitemap.xml antes do dev/build.
 *
 * Por que arquivos estáticos e não app/robots.ts + app/sitemap.ts: com
 * `cacheComponents` ativo, rotas de metadata não podem declarar
 * `dynamic`/`revalidate`, e o export estático (`AURA_EXPORT=1`) exige uma
 * dessas opções. Arquivos em public/ funcionam nos dois modos.
 *
 * Os slugs são lidos de src/data/products.ts (campo `slug` de cada produto).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

const productsSource = fs.readFileSync(path.join(root, "src", "data", "products.ts"), "utf8");
const slugs = [...productsSource.matchAll(/^\s{4}slug: "([a-z0-9-]+)",$/gm)].map((m) => m[1]);
if (slugs.length === 0) throw new Error("Nenhum slug encontrado em src/data/products.ts");

const urls = [
  { loc: "/", priority: "1.0" },
  { loc: "/produtos/", priority: "0.8" },
  ...slugs.map((s) => ({ loc: `/produtos/${s}/`, priority: "0.7" })),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${siteUrl}${u.loc}</loc><changefreq>monthly</changefreq><priority>${u.priority}</priority></url>`).join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /
Disallow: /checkout

Sitemap: ${siteUrl}/sitemap.xml
`;

fs.writeFileSync(path.join(root, "public", "sitemap.xml"), sitemap);
fs.writeFileSync(path.join(root, "public", "robots.txt"), robots);
console.log(`SEO: robots.txt e sitemap.xml gerados para ${siteUrl} (${slugs.length} produtos).`);
