import type { ExerciseResponse } from "@/dtos/exercises/responses";
import type { SetPaginatedResponse } from "@/dtos/sets/responses";
import type { WorkoutResponse } from "@/dtos/workouts/responses";

export type Workout = WorkoutResponse;

export type WorkoutExercise = WorkoutResponse["workoutExercises"][number] & {
  hasCompletedSets?: boolean;
};

export type WorkoutExerciseSet = SetPaginatedResponse["data"][number] & {
  isOptimistic?: boolean;
};

export type Exercise = ExerciseResponse["data"][number];

export type MuscleGroups = Exercise["muscleGroups"][number];

export type WorkoutSession = {
  id: number;
  workoutId: number;
  completedAt: string | null;
  duration?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type WorkoutSessionDetail = {
  id: number;
  workoutId: number;
  userId: string;
  completedAt: string | null;
  duration: number | null;
  notes: string | null;
  lastIncompleteExerciseIndex?: number;
  workout: {
    id: number;
    name: string;
    order: number;
    workoutExercises: WorkoutExercise[];
  };
  createdAt: string;
  updatedAt: string;
};

export type WorkoutSessionSummary = {
  session: {
    id: number;
    workoutName: string;
    completedAt: string | null;
    duration: number;
  };
  stats: {
    totalSets: number;
    totalVolume: number;
    exercisesCompleted: number;
  };
  exerciseBreakdown: Array<{
    exerciseName: string;
    sets: number;
    volume: number;
    avgReps: number;
    avgWeight: number;
  }>;
};
