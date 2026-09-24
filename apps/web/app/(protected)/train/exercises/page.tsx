import { PageHeader } from "@forgefit/ui";
import { ExerciseCatalog } from "@/components/features/exercise-catalog";
import { getExercises } from "@/lib/data/queries";

export default async function ExercisesPage() {
  const exercises = await getExercises();
  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="Exercise library"
        title="Find your next movement"
        description="Filter by muscle, level, or the equipment you already have, then assign exercises directly to your week."
      />
      <ExerciseCatalog exercises={exercises} />
    </div>
  );
}
