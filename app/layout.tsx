import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { AppWrapper } from "@/components/app-wrapper";
import "./globals.css";
import Script from "next/script"; // Нужно для вставки SDK

export const metadata: Metadata = {
  title: "Crypto Genesis Academy",
  description: "Your path to professional crypto expertise",
  generator: 'v0.app'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        {/* ПОДКЛЮЧЕНИЕ PI SDK — ОБЯЗАТЕЛЬНО */}
        <Script 
          src="https://minepi.com" 
          strategy="beforeInteractive" 
        />
      </head>
      <body>
        <AppWrapper>{children}</AppWrapper>
      </body>
    </html>
  );
}
