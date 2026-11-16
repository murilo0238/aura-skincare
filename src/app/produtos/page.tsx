import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogView } from "@/components/catalog/catalog-view";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Coleção",
  description: "Todos os produtos AURA: limpeza, tratamento, hidratação e proteção. Filtre por categoria e preço, ou busque pelo nome.",
  alternates: { canonical: "/produtos" },
  openGraph: { title: "Coleção AURA", url: "/produtos" },
};

function CatalogFallback() {
  return (
    <div aria-busy="true" aria-label="Carregando produtos">
      <div className="h-17 border-b border-tinta/10" />
      <div className="grid grid-cols-2 gap-x-3 gap-y-12 pt-24 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8">
        {products.slice(0, 3).map((p) => (
          <div key={p.slug} className="aspect-4/5 animate-pulse bg-calcario/60" />
        ))}
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <div className="shell pb-24 lg:pb-36">
      <header className="grid gap-6 pt-12 pb-10 lg:grid-cols-12 lg:items-end lg:pt-20 lg:pb-14">
        <h1 className="font-display text-display-l lg:col-span-6">A coleção</h1>
        <p className="max-w-md text-tinta/75 lg:col-span-5 lg:col-start-8 lg:pb-2">
          Cinco fórmulas para limpar, preparar, hidratar e concluir. Filtre por categoria ou faixa de preço, ou busque pelo
          que procura.
        </p>
      </header>
      <Suspense fallback={<CatalogFallback />}>
        <CatalogView />
      </Suspense>
    </div>
  );
}
