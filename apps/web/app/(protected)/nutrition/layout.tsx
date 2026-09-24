import type { ReactNode } from "react";
import { SectionTabs } from "@/components/section-tabs";

export default function NutritionLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SectionTabs
        label="Nutrition"
        tabs={[
          { href: "/nutrition", label: "Recipes", alsoActiveFor: ["/nutrition/recipes/"] },
          { href: "/nutrition/grocery", label: "Grocery" },
        ]}
      />
      {children}
    </>
  );
}
