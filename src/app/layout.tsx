import type { Metadata } from "next";
import { Fraunces, Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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
  title: "Tempoly — Te citan o no existes",
  description:
    "Tempoly mide cómo apareces en ChatGPT, Claude, Perplexity y Gemini cuando un cliente busca a alguien como tú. G2 para la era AI, en LATAM.",
  metadataBase: new URL("https://tempoly.xyz"),
  openGraph: {
    title: "Tempoly — Te citan o no existes",
    description:
      "Leaderboards públicos de citaciones AI por industria y país. Empezamos en Ecuador, sector legal.",
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
      className={`${fraunces.variable} ${geist.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-fg">{children}</body>
    </html>
  );
}
