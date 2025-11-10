import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/lib/StoreProvider";
import Header from "@/components/layout/Header";
import { Toaster } from "sonner";
import ThemeProvider from "@/components/providers/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "eCommerce Shop",
  description: "A modern eCommerce shop built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <StoreProvider>
          <ThemeProvider>
            <Header />
            <main>{children}</main>
            <Toaster position="top-right" />
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
