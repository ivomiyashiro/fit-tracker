import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/server/lib/types.js";
import type { SingleExerciseResponse } from "@/server/modules/exercises/dtos/responses/index.js";
import type { CreateRoute } from "@/server/modules/exercises/endpoints/index.js";

import db from "@/server/db/index.js";
import { exercise, exerciseMuscleGroup } from "@/server/db/schemas/index.js";

export const createExercise: AppRouteHandler<CreateRoute> = async (c) => {
  const { name, muscleGroupIds } = c.req.valid("json");

  // Check if exercise with same name already exists
  const existingExercise = await db.query.exercise.findFirst({
    where: eq(exercise.name, name),
  });

  if (existingExercise) {
    return c.json(
      { message: `An exercise with name ${existingExercise.name} already exists` },
      HttpStatusCodes.CONFLICT,
    );
  }

  // Create exercise
  const [newExercise] = await db.insert(exercise).values({
    name,
  }).returning();

  // Create exercise-muscle group relationships
  await db.insert(exerciseMuscleGroup).values(
    muscleGroupIds.map(muscleGroupId => ({
      exerciseId: newExercise.id,
      muscleGroupId,
    })),
  );

  // Get muscle groups for response
  const muscleGroups = await db.query.muscleGroup.findMany({
    where: (muscleGroup, { inArray }) => inArray(muscleGroup.id, muscleGroupIds),
  });

  const result: SingleExerciseResponse = {
    id: newExercise.id,
    name: newExercise.name,
    muscleGroups: muscleGroups.map(mg => ({
      id: mg.id,
      name: mg.name,
    })),
    createdAt: newExercise.createdAt.toISOString(),
    updatedAt: newExercise.updatedAt.toISOString(),
  };

  return c.json(result, HttpStatusCodes.CREATED);
};
