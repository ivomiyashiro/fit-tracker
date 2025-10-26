import type { ExerciseResponse } from "@/dtos/exercises/responses";
import type { SetPaginatedResponse } from "@/dtos/sets/responses";
import type { WorkoutResponse } from "@/dtos/workouts/responses";

export type Workout = WorkoutResponse;

export type WorkoutExercise = WorkoutResponse["workoutExercises"][number];

export type WorkoutExerciseSet = SetPaginatedResponse["data"][number] & {
  isOptimistic?: boolean;
};

export type Exercise = ExerciseResponse["data"][number];

export type MuscleGroups = Exercise["muscleGroups"][number];
