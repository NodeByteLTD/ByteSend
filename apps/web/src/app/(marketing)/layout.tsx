import { SessionWrapper } from "~/components/marketing/SessionWrapper";
import { TopNav } from "~/components/marketing/TopNav";
import { SiteFooter } from "~/components/marketing/SiteFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ByteSend – The email platform for modern teams",
  description:
    "Send product, transactional and marketing emails. Pay only for what you send.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  metadataBase: new URL("https://bytesend.cloud"),
  openGraph: {
    title: "ByteSend – The email platform for modern teams",
    description: "Send product, transactional and marketing emails. Pay only for what you send.",
    url: "https://bytesend.cloud",
    siteName: "ByteSend",
    images: [
      {
        url: "https://cmap.pics/ibNxG/tKrLh4.png",
        width: 1200,
        height: 630,
        alt: "ByteSend – The email platform for modern teams",
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ByteSend – The email platform for modern teams",
    description: "Send product, transactional and marketing emails. Pay only for what you send.",
    images: ["https://cmap.pics/ibNxG/tKrLh4.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://bytesend.cloud",
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionWrapper>
      <TopNav />
      {children}
      <SiteFooter />
    </SessionWrapper>
  );
}
