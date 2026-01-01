import "@/app/globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import mascot from "@/assets/vain/mascot.webp";
import { LayoutWrapper } from "./layout-wrapper";
import Head from "next/head";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const viewport: Viewport = {
  themeColor: "#452d57",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://vain.bot"),
  title: "vain",
  description: "The only all-in-one Discord bot for your server. ",
  twitter: {
    site: "https://vain.bot/",
    card: "player",
  },
  openGraph: {
    url: "https://vain.bot/",
    type: "website",
    title: "vain",
    // siteName: "vain.bot",
    description: "The only all-in-one Discord bot for your server. ",
    images: [
      {
        url: mascot.src,
        width: 500,
        height: 500,
        alt: "vain",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <meta property="theme-color" content="#443D4B" />
      </Head>
      <body
        className={`bg-vain-800 ${inter.className} font-inter leading-line37 tracking-tighterCustom1Point2 flex flex-col min-h-screen justify-between dark font-light`}
      >
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
