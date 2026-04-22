import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { AppWrapper } from "@/components/app-wrapper";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Crypto Genesis Academy",
  description: "Your path to professional crypto expertise",
  generator: 'v0.app'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        {/* Загружаем основной файл SDK */}
        <Script 
          src="https://sdk.minepi.com/pi-sdk.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <AppWrapper>{children}</AppWrapper>

        {/* ✅ Добавляем блок инициализации перед закрывающим тегом body */}
        <Script id="pi-sdk-init" strategy="afterInteractive">
          {`
            if (window.Pi) {
              window.Pi.init({ version: "2.0" });
              console.log("Pi SDK initialized");
            }
          `}
        </Script>
      </body>
    </html>
  );
}
