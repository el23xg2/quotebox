import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "QuoteBox — Simple Quotes, Contracts & Invoices for $9/month | HoneyBook Alternative",
    template: "%s | QuoteBox",
  },
  description:
    "The simplest tool for freelancers to send professional quotes, get contracts signed online, and accept payments. Start free, upgrade to Pro for $9/month. HoneyBook alternative without the bloat.",
  keywords: ["freelance quotes", "contract signing", "online invoices", "honeybook alternative", "freelance invoice tool", "e-signature", "freelance quoting software"],
  openGraph: {
    title: "QuoteBox — Quotes, Contracts & Invoices for $9/month",
    description: "The simplest tool for freelancers to send quotes, sign contracts, and get paid. Start free, Pro for $9/month.",
    url: "https://quotebox.pro",
    siteName: "QuoteBox",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
