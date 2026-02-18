import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/modules/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PathCanvas | Turn Your Activities into Art",
  description: "Beautifully render your GPX files into minimalist posters. Perfect for athletes and design lovers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-zinc-950 dark:bg-black dark:text-zinc-50`}
      >
        <Navbar />
        <main>{children}</main>
        <footer className="border-t border-zinc-200 py-12 dark:border-zinc-800">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <p className="text-sm text-zinc-500">
              © {new Date().getFullYear()} PathCanvas. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
