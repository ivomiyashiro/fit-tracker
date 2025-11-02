import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/server/lib/types.js";
import type { GetWorkoutSessionRoute } from "@/server/workout-sessions/endpoints/get-workout-session.endpoint.js";

import db from "@/server/db/index.js";
import { workoutSession } from "@/server/db/schemas/index.js";

export const getWorkoutSession: AppRouteHandler<GetWorkoutSessionRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const userId = c.get("auth").user.id;

  const session = await db.query.workoutSession.findFirst({
    where: eq(workoutSession.id, id),
    with: {
      workout: {
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
            orderBy: (workoutExercise, { asc }) => [asc(workoutExercise.order)],
          },
        },
      },
    },
  });

  if (!session) {
    return c.json(
      { message: "Workout session not found" },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  if (session.userId !== userId) {
    return c.json(
      { message: "Unauthorized" },
      HttpStatusCodes.UNAUTHORIZED,
    );
  }

  const response = {
    id: session.id,
    workoutId: session.workoutId,
    userId: session.userId,
    completedAt: session.completedAt?.toISOString() ?? null,
    duration: session.duration,
    notes: session.notes,
    workout: {
      id: session.workout.id,
      name: session.workout.name,
      order: session.workout.order,
      workoutExercises: session.workout.workoutExercises.map(we => ({
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
      })),
    },
    createdAt: session.createdAt.toISOString(),
    updatedAt: session.updatedAt.toISOString(),
  };

  return c.json(response, HttpStatusCodes.OK);
};
