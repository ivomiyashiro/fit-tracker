import { desc, eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/server/lib/types.js";
import type { GetNextWorkoutRoute } from "@/server/workouts/endpoints/get-next-workout.endpoint.js";

import db from "@/server/db/index.js";
import { workout, workoutSession } from "@/server/db/schemas/index.js";

export const getNextWorkout: AppRouteHandler<GetNextWorkoutRoute> = async (c) => {
  const userId = c.get("auth").user.id;

  const userWorkouts = await db.query.workout.findMany({
    where: eq(workout.userId, userId),
    orderBy: [workout.order],
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
  });

  if (userWorkouts.length === 0) {
    return c.json(
      { message: "No workouts found. Create your first workout!" },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  const lastSession = await db.query.workoutSession.findFirst({
    where: eq(workoutSession.userId, userId),
    orderBy: [desc(workoutSession.completedAt)],
  });

  let nextWorkout;

  if (!lastSession) {
    nextWorkout = userWorkouts[0];
  }
  else {
    const lastWorkoutIndex = userWorkouts.findIndex(
      w => w.id === lastSession.workoutId,
    );

    if (lastWorkoutIndex === -1) {
      nextWorkout = userWorkouts[0];
    }
    else {
      const nextIndex = (lastWorkoutIndex + 1) % userWorkouts.length;
      nextWorkout = userWorkouts[nextIndex];
    }
  }

  if (!nextWorkout) {
    return c.json(
      { message: "No workouts found" },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  const response = {
    id: Number(nextWorkout.id),
    name: nextWorkout.name,
    order: Number(nextWorkout.order),
    workoutExercises: nextWorkout.workoutExercises.map(we => ({
      id: Number(we.id),
      order: Number(we.order),
      exercise: {
        id: Number(we.exercise!.id),
        name: we.exercise!.name,
        muscleGroups: we.exercise!.exerciseMuscleGroups.map(emg => ({
          id: Number(emg.muscleGroup!.id),
          name: emg.muscleGroup!.name,
        })),
      },
    })),
    lastSession: lastSession
      ? {
          id: Number(lastSession.id),
          completedAt: lastSession.completedAt.toISOString(),
        }
      : undefined,
    createdAt: nextWorkout.createdAt.toISOString(),
    updatedAt: nextWorkout.updatedAt.toISOString(),
  };

  return c.json(response, HttpStatusCodes.OK);
};
