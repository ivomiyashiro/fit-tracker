import type { ExerciseResponse } from "@/dtos/exercises/responses";
import type { SetResponse } from "@/dtos/sets/responses";
import type { WorkoutResponse } from "@/dtos/workouts/responses";

export type Workout = WorkoutResponse;

export type WorkoutExercise = WorkoutResponse["workoutExercises"][number];

export type WorkoutExerciseSet = SetResponse;

export type Exercise = ExerciseResponse["data"][number];

export type MuscleGroups = Exercise["muscleGroups"][number];