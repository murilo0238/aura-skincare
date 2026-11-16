import Link from "next/link";
import { categories } from "@/data/categories";
import { products } from "@/data/products";

const linkClass =
  "text-[0.9375rem] text-marfim/75 transition-colors hover:text-marfim underline-offset-4 hover:underline decoration-marfim/40";

export function SiteFooter() {
  return (
    <footer className="on-dark bg-cacau text-marfim">
      <div className="shell pt-20 pb-10 lg:pt-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Link href="/" className="wordmark text-[1.55rem] leading-none" aria-label="AURA, página inicial" translate="no">
              AURA
            </Link>
            <p className="font-display text-display-m mt-8 max-w-[14ch] text-marfim">Sua essência, em cada cuidado.</p>
          </div>

          <nav aria-label="Rodapé" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
            <div>
              <h2 className="text-sm text-marfim/55">A coleção</h2>
              <ul className="mt-4 space-y-2.5">
                {products.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/produtos/${p.slug}`} className={linkClass}>
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-sm text-marfim/55">Categorias</h2>
              <ul className="mt-4 space-y-2.5">
                {categories.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/produtos?categoria=${c.slug}`} className={linkClass}>
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h2 className="text-sm text-marfim/55">Navegar</h2>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <Link href="/#rotina" className={linkClass}>
                    Rotina de cuidados
                  </Link>
                </li>
                <li>
                  <Link href="/#filosofia" className={linkClass}>
                    Filosofia
                  </Link>
                </li>
                <li>
                  <Link href="/#descobrir" className={linkClass}>
                    Encontre seu cuidado
                  </Link>
                </li>
                <li>
                  <Link href="/checkout" className={linkClass}>
                    Checkout
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-20 rounded-sm border border-marfim/15 p-5 text-sm leading-relaxed text-marfim/70 lg:max-w-3xl">
          <p>
            <strong className="font-medium text-marfim">Esta loja é uma demonstração.</strong> AURA é uma marca fictícia:
            produtos, preços, fretes e pedidos são ilustrativos. Nenhum pagamento é solicitado, nenhum pedido é processado e
            nenhum dado pessoal é armazenado. As imagens são renders ilustrativos criados para o projeto, não fotografias de
            produtos reais.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-marfim/15 pt-6 text-sm text-marfim/60 sm:flex-row sm:items-center sm:justify-between">
          <p>AURA Skincare &amp; Beauty, marca fictícia.</p>
          <p>
            Projeto conceitual desenvolvido por{" "}
            <a
              href="https://garrastudios.online"
              target="_blank"
              rel="noopener"
              className="text-marfim/85 underline decoration-marfim/30 underline-offset-4 transition-colors hover:text-marfim hover:decoration-marfim"
            >
              Garra Studios
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
