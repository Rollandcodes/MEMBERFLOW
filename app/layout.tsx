import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://memberflow-eight.vercel.app"),
  title: "MemberFlow — Automate Your Community Onboarding",
  description: "Automate welcome messages, drip sequences, and member tagging for every new Whop community member.",
  openGraph: {
    title: "MemberFlow — Automate Your Community Onboarding",
    description: "Automate welcome messages, drip sequences, and member tagging for every new Whop community member.",
    siteName: "MemberFlow",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
