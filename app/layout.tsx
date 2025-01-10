import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { SessionProvider } from "next-auth/react";

import { navbarLinks } from "@/config/navbar";
import { MainNav } from "@/components/main-nav";

import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin"],
});

type RootLayoutProps = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${inter.className} scroll-smooth`}>
      <body className="min-h-screen bg-background antialiased">
        <NextTopLoader showSpinner={false} color="#2563eb" shadow={false} />
        <SessionProvider>
          <header>
            <MainNav items={navbarLinks.main} />
          </header>
          <main className="flex-1 py-16">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
