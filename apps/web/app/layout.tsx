import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { PwaRegister } from "@/components/pwa-register";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "FitForge", template: "%s · FitForge" },
  description: "Forge stronger workouts, smarter meals, and a simpler shopping list.",
  applicationName: "FitForge",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "FitForge" },
};

export const viewport: Viewport = { themeColor: "#09090b", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en-IN">
      <body>
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
