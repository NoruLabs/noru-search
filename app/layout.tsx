import type { Metadata } from "next";
import { Sora, Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { QueryProvider } from "./components/QueryProvider";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { BackgroundSwirl } from "./components/BackgroundSwirl";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Noru Search - Universal Space Data Browser",
  description:
    "Free & open-source space data explorer application that lets you browse NASA datasets, space news, and real-time space data from a single interface.",
  keywords: [
    "NASA",
    "space",
    "exoplanets",
    "asteroids",
    "Mars",
    "APOD",
    "near earth objects",
    "space weather",
    "astronomy",
  ],
  authors: [{ name: "Noru Labs", url: "https://github.com/NoruLabs" }],
  openGraph: {
    title: "Noru Search - Universal Space Data Browser",
    description:
      "Free & open-source space data explorer application that lets you browse NASA datasets, space news, and real-time space data from a single interface.",
    type: "website",
    siteName: "Noru Search",
  },
  twitter: {
    card: "summary_large_image",
    title: "Noru Search - Universal Space Data Browser",
    description:
      "Free & open-source space data explorer application that lets you browse NASA datasets, space news, and real-time space data from a single interface.",
  },
  metadataBase: new URL("https://noru-search.vercel.app"),
  icons: {
    icon: [
      { url: "/noru-icon.ico", sizes: "any" },
      { url: "/noru-icon.png", type: "image/png" },
    ],
    shortcut: "/noru-icon.ico",
    apple: "/noru-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#23262A" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body
        className={`${sora.variable} ${geistSans.variable} ${geistMono.variable} antialiased bg-bg-primary text-text-primary`}
      >
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        <ThemeProvider>
          <QueryProvider>
            <BackgroundSwirl />
            <div className="flex min-h-screen flex-col bg-transparent relative z-10">
              <Header />
              {children}
              <Footer />
            </div>
          </QueryProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}

