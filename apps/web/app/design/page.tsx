import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DesignGallery } from "./design-gallery";

export const metadata: Metadata = { title: "Design system" };

// Living reference for the ForgeFit design system. Development only.
export default function DesignPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <DesignGallery />;
}
