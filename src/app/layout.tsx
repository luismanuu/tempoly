import type { Metadata } from "next";
import {
  Fraunces,
  Geist,
  JetBrains_Mono,
  Outfit,
  Pixelify_Sans,
} from "next/font/google";
import "./globals.css";

/* New retro-arcade landing fonts */
const pixelify = Pixelify_Sans({
  variable: "--font-pixelify",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMonoNew = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

/* Legacy fonts — kept so /manifesto and /leaderboards keep rendering */
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tempoly — Tu idea, construida.",
  description:
    "Estudio creativo y técnico. Traes una idea —un sitio, un producto, un agente de IA, una automatización— y la construimos contigo, de la idea al lanzamiento.",
  metadataBase: new URL("https://tempoly.xyz"),
  openGraph: {
    title: "Tempoly — Tu idea, construida.",
    description:
      "Estudio creativo y técnico. Sitios web, productos digitales, agentes de IA y automatizaciones, de la idea al lanzamiento.",
    url: "https://tempoly.xyz",
    siteName: "Tempoly",
    locale: "es",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${pixelify.variable} ${outfit.variable} ${jetbrainsMonoNew.variable} ${fraunces.variable} ${geist.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-fg">{children}</body>
    </html>
  );
}
