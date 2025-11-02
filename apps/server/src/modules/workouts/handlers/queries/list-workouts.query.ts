import { eq } from "drizzle-orm";

import type { AppRouteHandler } from "@/server/lib/types.js";
import type { WorkoutResponse } from "@/server/workouts/dtos/responses/index.js";
import type { ListRoute } from "@/server/workouts/endpoints/index.js";

import db from "@/server/db/index.js";
import { workout } from "@/server/db/schemas/index.js";

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
    orderBy: [workout.order],
  });

  const result: WorkoutResponse[] = workouts.map(workout => ({
    id: workout.id,
    name: workout.name,
    order: workout.order,
    workoutExercises: workout.workoutExercises.map(we => ({
      id: we.id,
      order: we.order,
      exercise: {
        id: we.exercise!.id,
        name: we.exercise!.name,
        muscleGroups: we.exercise!.exerciseMuscleGroups.map(emg => ({
          id: emg.muscleGroup!.id,
          name: emg.muscleGroup!.name,
        })),
      },
      createdAt: we.createdAt.toISOString(),
      updatedAt: we.updatedAt.toISOString(),
    })),
    createdAt: workout.createdAt.toISOString(),
    updatedAt: workout.updatedAt.toISOString(),
  }));

  return c.json(result);
};
