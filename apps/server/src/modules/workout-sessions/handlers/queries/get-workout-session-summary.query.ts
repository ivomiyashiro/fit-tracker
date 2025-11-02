import { eq, inArray } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/server/lib/types.js";
import type { GetWorkoutSessionSummaryRoute } from "@/server/workout-sessions/endpoints/get-workout-session-summary.endpoint.js";

import db from "@/server/db/index.js";
import { workoutExerciseSet, workoutSession } from "@/server/db/schemas/index.js";

export const getWorkoutSessionSummary: AppRouteHandler<GetWorkoutSessionSummaryRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const userId = c.get("auth").user.id;

  const session = await db.query.workoutSession.findFirst({
    where: eq(workoutSession.id, id),
    with: {
      workout: {
        with: {
          workoutExercises: {
            with: {
              exercise: true,
            },
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

  if (!session.completedAt) {
    return c.json(
      { message: "Workout session not yet completed" },
      HttpStatusCodes.BAD_REQUEST,
    );
  }

  const workoutExerciseIds = session.workout.workoutExercises.map(we => we.id);

  const sets = await db
    .select()
    .from(workoutExerciseSet)
    .where(inArray(workoutExerciseSet.workoutExerciseId, workoutExerciseIds));

  const exerciseStats = new Map<number, { name: string; sets: number; totalVolume: number; totalReps: number; totalWeight: number }>();

  session.workout.workoutExercises.forEach((we) => {
    exerciseStats.set(we.id, {
      name: we.exercise!.name,
      sets: 0,
      totalVolume: 0,
      totalReps: 0,
      totalWeight: 0,
    });
  });

  sets.forEach((set) => {
    const stats = exerciseStats.get(set.workoutExerciseId!);
    if (stats) {
      stats.sets += 1;
      stats.totalVolume += set.weight * set.reps;
      stats.totalReps += set.reps;
      stats.totalWeight += set.weight;
    }
  });

  const exerciseBreakdown = Array.from(exerciseStats.values()).map(stats => ({
    exerciseName: stats.name,
    sets: stats.sets,
    volume: stats.totalVolume,
    avgReps: stats.sets > 0 ? Math.round(stats.totalReps / stats.sets) : 0,
    avgWeight: stats.sets > 0 ? Math.round(stats.totalWeight / stats.sets) : 0,
  }));

  const totalSets = sets.length;
  const totalVolume = sets.reduce((sum, set) => sum + (set.weight * set.reps), 0);
  const exercisesCompleted = Array.from(exerciseStats.values()).filter(s => s.sets > 0).length;

  const duration = session.duration ?? 0;

  const response = {
    session: {
      id: session.id,
      workoutName: session.workout.name,
      completedAt: session.completedAt?.toISOString() ?? null,
      duration,
    },
    stats: {
      totalSets,
      totalVolume,
      exercisesCompleted,
    },
    exerciseBreakdown,
  };

  return c.json(response, HttpStatusCodes.OK);
};
