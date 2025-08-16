import { eq } from "drizzle-orm";

import type { AppRouteHandler } from "@/server/lib/types";
import type { WorkoutResponse } from "@/server/workouts/dtos/responses";
import type { ListRoute } from "@/server/workouts/endpoints";

import db from "@/server/db";
import { workout } from "@/server/db/schemas";

export const listWorkouts: AppRouteHandler<ListRoute> = async (c) => {
  const userId = c.get("auth").user.id;

  const workouts = await db.query.workout.findMany({
    with: {
      workoutExercises: {
        with: {
          exercise: {
            with: {
              exerciseMuscleGroups: {
                with: {
                  muscleGroup: true,
                },
              },
            },
          },
        },
      },
    },
    where: eq(workout.userId, userId),
  });

  const result: WorkoutResponse[] = workouts.map(workout => ({
    id: workout.id,
    name: workout.name,
    workoutExercises: workout.workoutExercises.map(we => ({
      id: we.id,
      exercise: {
        id: we.exercise!.id,
        name: we.exercise!.name,
        muscleGroups: we.exercise!.exerciseMuscleGroups.map(emg => emg.muscleGroup!.name),
      },
      createdAt: we.createdAt.toISOString(),
      updatedAt: we.updatedAt.toISOString(),
    })),
    createdAt: workout.createdAt.toISOString(),
    updatedAt: workout.updatedAt.toISOString(),
  }));

  return c.json(result);
};
