import { asc, eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/server/lib/types.js";
import type { WorkoutResponse } from "@/server/workouts/dtos/responses/index.js";
import type { GetOneRoute } from "@/server/workouts/endpoints/index.js";

import db from "@/server/db/index.js";
import { workout, workoutExercise } from "@/server/db/schemas/index.js";

export const getOneWorkout: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const userId = c.get("auth").user.id;

  const workoutData = await db.query.workout.findFirst({
    with: {
      workoutExercises: {
        orderBy: [asc(workoutExercise.order)],
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
    where: eq(workout.id, id),
  });

  if (!workoutData || workoutData.userId !== userId) {
    return c.json({ message: "Workout not found" }, HttpStatusCodes.NOT_FOUND);
  }

  const result: WorkoutResponse = {
    id: workoutData.id,
    name: workoutData.name,
    workoutExercises: workoutData.workoutExercises.map(we => ({
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
    createdAt: workoutData.createdAt.toISOString(),
    updatedAt: workoutData.updatedAt.toISOString(),
  };

  return c.json(result, HttpStatusCodes.OK);
};
