import type { Metadata, Viewport } from "next";
import { Geist, Barlow_Condensed } from "next/font/google";
import { siteConfig } from "@/lib/site-config";
import { siteUrl } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.seo.title,
    template: `%s | ${siteConfig.shortName} Transportes`,
  },
  description: siteConfig.seo.description,
  keywords: [...siteConfig.seo.keywords],
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteUrl }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "Transporte rodoviário de cargas",
  // Evita que o Google transforme telefone/endereço em links automáticos
  // e quebre o layout no iOS.
  formatDetection: { telephone: false, address: false, email: false },
  alternates: {
    canonical: "/",
  },
  // Sem isso o Google costuma exibir só uma miniatura pequena e cortar o texto.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: siteConfig.name,
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
  },
  // Código do Google Search Console. Deixe a env vazia até ter o código.
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  themeColor: "#0A2440",
};

const sans = Geist({
  variable: "--font-sans",
  display: "swap",
  subsets: ["latin"],
});

// Tipografia condensada e pesada, na mesma linha da logo.
const display = Barlow_Condensed({
  variable: "--font-display",
  display: "swap",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${sans.variable} ${display.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
