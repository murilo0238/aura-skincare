/** URL pública do site. Defina NEXT_PUBLIC_SITE_URL no deploy. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const siteName = "AURA Skincare & Beauty";
export const siteDescription =
  "AURA é uma marca conceitual de skincare: cinco fórmulas essenciais pensadas como um único ritual. Loja demonstrativa desenvolvida pela Garra Studios.";
