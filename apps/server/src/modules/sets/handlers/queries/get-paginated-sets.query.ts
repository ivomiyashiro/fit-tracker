import { and, count, eq, inArray } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/server/lib/types.js";
import type { SetPaginatedResponse } from "@/server/modules/sets/dtos/responses/set.response.js";
import type { GetPaginatedSetsRoute } from "@/server/sets/endpoints/index.js";

import db from "@/server/db/index.js";
import { workout, workoutExerciseSet } from "@/server/db/schemas/index.js";

export const getPaginatedSets: AppRouteHandler<GetPaginatedSetsRoute> = async (c) => {
  const { page = 1, limit = 10, workoutExerciseId } = c.req.valid("query");
  const userId = c.get("auth").user.id;

  // Get user's workout exercise IDs to filter sets
  const userWorkouts = await db.query.workout.findMany({
    where: eq(workout.userId, userId),
    with: {
      workoutExercises: true,
    },
  });

  const userWorkoutExerciseIds = userWorkouts.flatMap(w => w.workoutExercises.map(we => we.id));

  // Build where conditions
  const whereConditions = [inArray(workoutExerciseSet.workoutExerciseId, userWorkoutExerciseIds)];

  if (workoutExerciseId) {
    // Verify the workout exercise belongs to the user
    const workoutExercise = userWorkoutExerciseIds.includes(workoutExerciseId);
    if (!workoutExercise) {
      return c.json(
        { message: "Workout exercise not found" },
        HttpStatusCodes.NOT_FOUND,
      );
    }
    whereConditions.push(eq(workoutExerciseSet.workoutExerciseId, workoutExerciseId));
  }

  // Get total count
  const totalCount = await db
    .select({ count: count() })
    .from(workoutExerciseSet)
    .where(and(...whereConditions));

  const total = totalCount[0]?.count || 0;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;

  // Get paginated sets
  const sets = await db.query.workoutExerciseSet.findMany({
    where: and(...whereConditions),
    orderBy: (workoutExerciseSet, { desc }) => [desc(workoutExerciseSet.createdAt)],
    limit,
    offset,
  });

  const result: SetPaginatedResponse = {
    data: sets.map(set => ({
      id: set.id,
      workoutExerciseId: set.workoutExerciseId!,
      reps: set.reps,
      weight: set.weight,
      rir: set.rir,
      notes: set.notes,
      createdAt: set.createdAt.toISOString(),
      updatedAt: set.updatedAt.toISOString(),
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };

  return c.json(result, HttpStatusCodes.OK);
};
