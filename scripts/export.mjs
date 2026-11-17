/**
 * Export estático da demo (pasta out/), usado em aura.garrastudios.online.
 * Uso: npm run export   (NEXT_PUBLIC_SITE_URL pode sobrescrever a URL)
 */
import { spawnSync } from "node:child_process";

const env = {
  ...process.env,
  AURA_EXPORT: "1",
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "https://aura.garrastudios.online",
};

for (const cmd of ["node scripts/generate-seo.mjs", "npx next build"]) {
  const result = spawnSync(cmd, { stdio: "inherit", shell: true, env });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
