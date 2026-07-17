import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — $9/month Pro Plan | QuoteBox",
  description:
    "Free plan with 3 clients and 5 documents. Pro plan at $9/month for unlimited clients, unlimited documents, e-signatures, and payment processing. Annual and lifetime plans available.",
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
