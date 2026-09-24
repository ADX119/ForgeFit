import { DIET_PREFERENCE_LABELS, type DietPreference } from "@forgefit/domain";

// Echoes the Indian food-label convention: green for vegetarian, brown for non-vegetarian.
const markColour: Record<DietPreference, string> = {
  VEGAN: "border-emerald-400 text-emerald-400",
  VEGETARIAN: "border-green-500 text-green-500",
  EGGETARIAN: "border-amber-400 text-amber-400",
  NON_VEGETARIAN: "border-orange-700 text-orange-600",
};

export function DietMark({ diet }: { diet: DietPreference }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
      <span
        aria-hidden="true"
        className={`grid size-3.5 place-items-center rounded-[3px] border-[1.5px] ${markColour[diet]}`}
      >
        <span className="size-1.5 rounded-full bg-current" />
      </span>
      {DIET_PREFERENCE_LABELS[diet]}
    </span>
  );
}
