import type { ReactNode } from "react";
import { isSupabaseConfigured } from "@fitforge/supabase";
import { SetupRequired } from "@/components/setup-required";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return isSupabaseConfigured() ? children : <SetupRequired />;
}
