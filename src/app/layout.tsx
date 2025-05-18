import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Container from "@/components/Container";
import { Navbar } from "@/components/Navbar";
import { Providers } from "@/app/providers";
import { Bounce, ToastContainer } from "react-toastify";
import { Suspense } from "react";
import { Spinner } from "@/components/Spinner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Disclaimer } from "@/components/Disclaimer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Naddify",
  description: "A community-driven platform for project curation on Monad",
  keywords: [
    "Naddify",
    "Monad projects",
    "project curation",
    "blockchain discovery",
    "crypto reputation",
    "verify Web3 projects",
    "Monad ecosystem",
    "Naddify platform",
    "decentralized project ranking",
    "community votes blockchain",
    "NFT projects Monad",
    "Monad Web3 apps",
    "trustworthy crypto projects",
    "scam detection Web3",
  ],
  authors: [
    { name: "Tonashiro" },
    { name: "1stBenjaNAD" },
    { name: "Toadster69" },
    { name: "andalfthegreat" },
  ],
  creator: "Tonashiro",
  publisher: "Tonashiro",
  metadataBase: new URL("https://www.naddify.xyz"),
  alternates: {
    canonical: "https://www.naddify.xyz",
  },
  openGraph: {
    title: "Naddify",
    description: "A community-driven platform for project curation on Monad",
    url: "https://www.naddify.xyz",
    siteName: "Naddify",
    images: [
      {
        url: "https://www.naddify.xyz/twitter_card.png",
        width: 1200,
        height: 630,
        alt: "Naddify- A community-driven platform for project curation on Monad",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@naddify_xyz",
    creator: "@naddify_xyz",
    title: "Naddify",
    description: "A community-driven platform for project curation on Monad",
    images: [
      {
        url: "https://www.naddify.xyz/twitter_card.png",
        width: 1200,
        height: 630,
        alt: "Naddify - A community-driven platform for project curation on Monad",
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
      <SpeedInsights />
      <Analytics />
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-screen w-screen">
            <Spinner />
          </div>
        }
      >
        <Providers>
          <body
            className={`
          ${geistSans.variable} ${geistMono.variable}
          font-sans antialiased
        `}
          >
            <Disclaimer />
            <div className="fixed z-[-1] inset-0 min-h-screen w-screen bg-gradient pointer-events-none" />
            <Navbar />
            <Container>{children}</Container>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick={false}
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
              transition={Bounce}
            />
          </body>
        </Providers>
      </Suspense>
    </html>
  );
}
