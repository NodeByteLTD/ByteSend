import "./globals.css";

import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@bytesend/ui";
import { Toaster } from "@bytesend/ui/src/toaster";

import { Metadata } from "next";

const GeistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const GeistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

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
        url: "https://embrly.ca/ibNxG/eq0hwI.png/raw",
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
    images: ["https://embrly.ca/ibNxG/eq0hwI.png/raw"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://bytesend.cloud",
  },
};


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-background">
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} app bg-background`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
