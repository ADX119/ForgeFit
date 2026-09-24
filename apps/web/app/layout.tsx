import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { PwaRegister } from "@/components/pwa-register";
import { ToastProvider } from "@/components/toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

export const metadata: Metadata = {
  title: { default: "ForgeFit", template: "%s · ForgeFit" },
  description: "Forge stronger workouts, smarter meals, and a simpler shopping list.",
  applicationName: "ForgeFit",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "ForgeFit" },
};

export const viewport: Viewport = { themeColor: "#0a0a0a", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en-IN" className={inter.variable}>
      <body>
        <ToastProvider>{children}</ToastProvider>
        <PwaRegister />
      </body>
    </html>
  );
}
