import type { ExerciseResponse } from "@/dtos/exercises/responses";

export type Exercise = ExerciseResponse["data"][number];

export type MuscleGroup = Exercise["muscleGroups"][number];

export type SingleExercise = {
  id: number;
  name: string;
  muscleGroups: MuscleGroup[];
  createdAt: string;
  updatedAt: string;
};

export type MuscleGroupFull = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};
