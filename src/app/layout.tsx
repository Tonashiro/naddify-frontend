import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Container from "@/components/Container";
import { Navbar } from "@/components/Navbar";
import { Providers } from "@/app/providers";
import { Bounce, ToastContainer } from "react-toastify";
import { Suspense } from "react";
import { Spinner } from "@/components/Spinner";

// Import Geist fonts as CSS variables
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
  title: "Nadvisor",
  description: "A community-driven platform for project curation on Monad",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
