import { and, count, like, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { GetPaginatedExercisesRoute } from "@/server/exercises/endpoints/index.js";
import type { AppRouteHandler } from "@/server/lib/types.js";
import type { ExerciseResponse } from "@/server/modules/exercises/dtos/responses/index.js";

import db from "@/server/db/index.js";
import { exercise } from "@/server/db/schemas/index.js";

export const getPaginatedExercises: AppRouteHandler<GetPaginatedExercisesRoute> = async (c) => {
  const { page = 1, limit = 10, search } = c.req.valid("query");

  // Build where conditions
  const whereConditions = [];

  if (search && search.trim() !== "") {
    whereConditions.push(like(exercise.name, `%${search.trim()}%`));
  }

  // Get total count
  const totalCount = await db
    .select({ count: count() })
    .from(exercise)
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

  const total = totalCount[0]?.count || 0;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;

  // Get paginated exercises
  const exercises = await db.query.exercise.findMany({
    where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
    orderBy: () => [sql`LOWER(${exercise.name}) ASC`],
    limit,
    offset,
    with: {
      exerciseMuscleGroups: {
        with: {
          muscleGroup: true,
        },
      },
    },
  });

  const result: ExerciseResponse = {
    data: exercises.map(exercise => ({
      id: exercise.id,
      name: exercise.name,
      muscleGroups: exercise.exerciseMuscleGroups.map(emg => ({
        id: emg.muscleGroup!.id,
        name: emg.muscleGroup!.name,
      })),
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
