import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { SearchDialog } from "@/components/layout/search-dialog";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Providers } from "@/components/providers";
import { siteDescription, siteName, siteUrl } from "@/lib/site";
import "./globals.css";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-bodoni",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AURA — Sua essência, em cada cuidado",
    template: "%s | AURA Skincare & Beauty",
  },
  description: siteDescription,
  applicationName: siteName,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName,
    title: "AURA — Sua essência, em cada cuidado",
    description: siteDescription,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Frasco AURA Hydrate com o slogan Sua essência, em cada cuidado." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AURA — Sua essência, em cada cuidado",
    description: siteDescription,
    images: ["/og.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#ece6e0",
  colorScheme: "light",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${bodoni.variable} ${jost.variable}`}>
      <body className="flex min-h-svh flex-col">
        <Providers>
          <a
            href="#conteudo"
            className="fixed top-3 left-3 z-[60] -translate-y-24 rounded-full bg-cacau px-5 py-3 text-sm text-marfim transition-transform focus:translate-y-0"
          >
            Pular para o conteúdo
          </a>
          <SiteHeader />
          <main id="conteudo" className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <CartDrawer />
          <MobileMenu />
          <SearchDialog />
        </Providers>
      </body>
    </html>
  );
}
