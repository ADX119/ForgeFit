import type { ReactNode } from "react";
import { SectionTabs } from "@/components/section-tabs";

export default function TrainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SectionTabs
        label="Train"
        tabs={[
          { href: "/train", label: "Plan" },
          { href: "/train/exercises", label: "Exercises" },
        ]}
      />
      {children}
    </>
  );
}
