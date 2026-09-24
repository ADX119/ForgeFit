import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ExerciseView } from "@/lib/data/queries";
import { ExerciseCatalog } from "./exercise-catalog";

vi.mock("@/lib/actions/features", () => ({ addWorkoutEntry: vi.fn() }));

const exercises: ExerciseView[] = [
  {
    id: "c0000000-0000-4000-8000-000000000001",
    name: "Push-up",
    slug: "push-up",
    primary_muscle_group_id: "a0000000-0000-4000-8000-000000000001",
    difficulty: "BEGINNER",
    image_path: "/push-up.svg",
    suggested_sets: 3,
    suggested_reps: "8–15",
    description: "A foundational press.",
    tracking_type: "WEIGHT_REPS",
    owner_user_id: null,
    cues: [],
    default_rest_seconds: null,
    is_archived: false,
    muscle: { id: "a0000000-0000-4000-8000-000000000001", name: "Chest", slug: "chest" },
    equipment: [],
  },
  {
    id: "c0000000-0000-4000-8000-000000000004",
    name: "Pull-up",
    slug: "pull-up",
    primary_muscle_group_id: "a0000000-0000-4000-8000-000000000002",
    difficulty: "INTERMEDIATE",
    image_path: "/pull-up.svg",
    suggested_sets: 4,
    suggested_reps: "5–10",
    description: "A vertical pull.",
    tracking_type: "REPS_ADDED_WEIGHT",
    owner_user_id: null,
    cues: [],
    default_rest_seconds: null,
    is_archived: false,
    muscle: { id: "a0000000-0000-4000-8000-000000000002", name: "Back", slug: "back" },
    equipment: [
      {
        id: "b1",
        name: "Pull-up Bar",
        slug: "pull-up-bar",
        description: "Bar",
        image_path: "/bar.svg",
        mock_price_inr: 1299,
      },
    ],
  },
];

describe("ExerciseCatalog", () => {
  it("combines search and difficulty filters", () => {
    render(<ExerciseCatalog exercises={exercises} />);
    expect(screen.getByText("Push-up")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Difficulty"), { target: { value: "INTERMEDIATE" } });
    expect(screen.queryByText("Push-up")).not.toBeInTheDocument();
    expect(screen.getByText("Pull-up")).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText("Search exercises…"), {
      target: { value: "squat" },
    });
    expect(screen.getByText("No exercises found")).toBeInTheDocument();
  });
});
