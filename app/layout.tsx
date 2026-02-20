import type { Metadata } from "next";
import { Sora, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { QueryProvider } from "./components/QueryProvider";

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
  title: "Noru Search — Universal Space Data Browser",
  description:
    "Browse NASA datasets, discover exoplanets, track asteroids, and explore Mars rover photos — all in one place.",
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
    title: "Noru Search — Universal Space Data Browser",
    description:
      "Browse NASA datasets, discover exoplanets, track asteroids, and explore Mars rover photos.",
    type: "website",
    siteName: "Noru Search",
  },
  twitter: {
    card: "summary_large_image",
    title: "Noru Search — Universal Space Data Browser",
    description:
      "Browse NASA datasets, discover exoplanets, track asteroids, and explore Mars rover photos.",
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
      <body
        className={`${sora.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        <ThemeProvider>
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
