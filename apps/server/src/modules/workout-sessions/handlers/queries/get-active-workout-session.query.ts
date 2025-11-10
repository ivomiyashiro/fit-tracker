import { and, count, eq, gt, isNull } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/server/lib/types.js";
import type { GetActiveWorkoutSessionRoute } from "@/server/workout-sessions/endpoints/get-active-workout-session.endpoint.js";

import db from "@/server/db/index.js";
import { workoutExercise, workoutExerciseSet, workoutSession } from "@/server/db/schemas/index.js";

export const getActiveWorkoutSession: AppRouteHandler<GetActiveWorkoutSessionRoute> = async (c) => {
  const userId = c.get("auth").user.id;

  const session = await db.query.workoutSession.findFirst({
    where: and(
      eq(workoutSession.userId, userId),
      isNull(workoutSession.completedAt),
    ),
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
    orderBy: (workoutSession, { desc }) => [desc(workoutSession.createdAt)],
  });

  if (!session) {
    return c.json(
      { message: "No active workout session found" },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  // Get workout exercise IDs that have sets completed for this specific session
  const exercisesWithSets = await db
    .select({
      workoutExerciseId: workoutExercise.id,
      setCount: count(workoutExerciseSet.id),
    })
    .from(workoutExercise)
    .leftJoin(
      workoutExerciseSet,
      and(
        eq(workoutExercise.id, workoutExerciseSet.workoutExerciseId),
        eq(workoutExerciseSet.workoutSessionId, session.id),
      ),
    )
    .where(eq(workoutExercise.workoutId, session.workoutId))
    .groupBy(workoutExercise.id)
    .having(gt(count(workoutExerciseSet.id), 0));

  const completedExerciseIds = new Set(
    exercisesWithSets.map(e => e.workoutExerciseId),
  );

  // Find the index of the last incomplete exercise
  const lastIncompleteExerciseIndex = session.workout.workoutExercises.findIndex(
    we => !completedExerciseIds.has(we.id),
  );

  const response = {
    id: session.id,
    workoutId: session.workoutId,
    userId: session.userId,
    completedAt: session.completedAt?.toISOString() ?? null,
    duration: session.duration,
    notes: session.notes,
    lastIncompleteExerciseIndex: lastIncompleteExerciseIndex !== -1 ? lastIncompleteExerciseIndex : 0,
    workout: {
      id: session.workout.id,
      name: session.workout.name,
      order: session.workout.order,
      workoutExercises: session.workout.workoutExercises.map(we => ({
        id: we.id,
        order: we.order,
        hasCompletedSets: completedExerciseIds.has(we.id),
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
