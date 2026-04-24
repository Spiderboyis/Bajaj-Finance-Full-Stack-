import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BFHL — Hierarchical Data Processor",
  description:
    "Process hierarchical relationship data, detect cycles, build trees, and calculate depths. Built by Harshit Mathur.",
  keywords: ["BFHL", "tree", "hierarchy", "graph", "cycle detection"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#050510] text-[#e4e4f0]">
        {children}
      </body>
    </html>
  );
}
