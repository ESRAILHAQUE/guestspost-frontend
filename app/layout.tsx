import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: `Buy High-Quality Guest Posts - Authority Backlinks That Rank.`,
  description:
    "We are an SEO agency providing guest posts on real DA30+ websites. Boost rankings with safe, dofollow backlinks.",
  generator: "v0.dev",
  metadataBase: new URL("https://guestpostnow.io"),
  openGraph: {
    title: `Buy High-Quality Guest Posts - Authority Backlinks That Rank.`,
    description:
      "We are an SEO agency providing guest posts on real DA30+ websites. Boost rankings with safe, dofollow backlinks.",
    url: "https://guestpostnow.io",
    siteName: "GuestPostNow",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "GuestPostNow",
      },
    ],
    type: "website",
  },
  alternates: {
    canonical: "https://guestpostnow.io",
  },
  icons: {
    icon: "/images/favicon_io/favicon.ico",
    shortcut: "/images/favicon_io/favicon.ico",
    apple: "/images/favicon_io/apple-touch-icon.png",
    other: {
      rel: "icon",
      url: "/images/favicon_io/favicon-16x16.png",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/favicon_io/favicon.ico" sizes="any" />
        <link
          rel="apple-touch-icon"
          href="/images/favicon_io/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          href="/images/favicon_io/favicon-16x16.png"
          sizes="16x16"
        />
        <link
          rel="icon"
          type="image/png"
          href="/images/favicon_io/favicon-32x32.png"
          sizes="32x32"
        />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
