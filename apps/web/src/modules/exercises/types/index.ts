import type { ExerciseResponse } from "@/dtos/exercises/responses";

export type Exercise = ExerciseResponse["data"][number];

export type MuscleGroup = Exercise["muscleGroups"][number];
