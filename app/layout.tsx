import type { Metadata, Viewport } from "next";
import { Geist, Barlow_Condensed } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: `${siteConfig.name} — Transporte rodoviário de cargas`,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  keywords: [
    "transportadora",
    "transporte rodoviário de cargas",
    "carga refrigerada",
    "cadeia fria",
    "carga seca",
    "frete",
    "Minas Gerais",
    siteConfig.shortName,
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: defaultUrl,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
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
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${sans.variable} ${display.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
