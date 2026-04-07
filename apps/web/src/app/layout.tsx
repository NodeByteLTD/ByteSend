import "./globals.css";

import { Inter } from "next/font/google";
import { JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@bytesend/ui";
import { Toaster } from "@bytesend/ui/src/toaster";

import { TRPCReactProvider } from "~/trpc/react";
import { Metadata } from "next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

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
        url: "https://cmap.pics/ibNxG/KgGe77.png",
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
    images: ["https://cmap.pics/ibNxG/KgGe77.png"],
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
        className={`font-sans ${inter.variable} ${jetbrainsMono.variable} app bg-background`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Toaster />
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
