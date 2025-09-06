import { inArray } from "drizzle-orm";

import db from "@/server/db/index.js";
import { exercise } from "@/server/db/schemas/index.js";

export interface ExerciseWithMuscleGroups {
  id: number;
  name: string;
  muscleGroups: { id: number; name: string }[];
}

export interface WorkoutExerciseWithExercise {
  id: number;
  exercise: ExerciseWithMuscleGroups;
  createdAt: string;
  updatedAt: string;
}

/**
 * Efficiently fetches exercises with their associated muscle groups using a single optimized query.
 * Uses Drizzle relations to minimize database round trips.
 */
export async function getExercisesWithMuscleGroups(exerciseIds: number[]): Promise<ExerciseWithMuscleGroups[]> {
  if (exerciseIds.length === 0)
    return [];

  const exercisesWithRelations = await db.query.exercise.findMany({
    where: inArray(exercise.id, exerciseIds),
    with: {
      exerciseMuscleGroups: {
        with: {
          muscleGroup: true,
        },
      },
    },
  });

  return exercisesWithRelations.map(ex => ({
    id: ex.id,
    name: ex.name,
    muscleGroups: ex.exerciseMuscleGroups
      .filter(emg => emg.muscleGroup) // Filter out null muscle groups
      .map(emg => ({
        id: emg.muscleGroup!.id,
        name: emg.muscleGroup!.name,
      })),
  }));
}

/**
 * Transforms workout exercises and exercises into the response format.
 * Creates an efficient exercise lookup map to match workout exercises with their exercise data.
 */
export function mapWorkoutExercisesToResponse(
  workoutExercises: Array<{ id: number; exerciseId: number | null; createdAt: Date; updatedAt: Date }>,
  exercises: ExerciseWithMuscleGroups[],
): WorkoutExerciseWithExercise[] {
  const exerciseMap = new Map(exercises.map(ex => [ex.id, ex]));

  return workoutExercises.map((we) => {
    const exercise = exerciseMap.get(we.exerciseId!);
    if (!exercise) {
      throw new Error(`Exercise with id ${we.exerciseId} not found`);
    }

    return {
      id: we.id,
      exercise,
      createdAt: we.createdAt.toISOString(),
      updatedAt: we.updatedAt.toISOString(),
    };
  });
}
