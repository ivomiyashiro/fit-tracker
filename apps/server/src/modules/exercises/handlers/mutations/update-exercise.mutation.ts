import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/server/lib/types.js";
import type { SingleExerciseResponse } from "@/server/modules/exercises/dtos/responses/index.js";
import type { UpdateRoute } from "@/server/modules/exercises/endpoints/index.js";

import db from "@/server/db/index.js";
import { exercise, exerciseMuscleGroup } from "@/server/db/schemas/index.js";

export const updateExercise: AppRouteHandler<UpdateRoute> = async (c) => {
  const exerciseId = Number.parseInt(c.req.param("id"));
  const { name, muscleGroupIds } = c.req.valid("json");

  // Check if exercise exists
  const existingExercise = await db.query.exercise.findFirst({
    where: eq(exercise.id, exerciseId),
  });

  if (!existingExercise) {
    return c.json({ message: "Exercise not found" }, HttpStatusCodes.NOT_FOUND);
  }

  // Update exercise name if provided
  if (name !== undefined) {
    await db.update(exercise)
      .set({
        name,
        updatedAt: new Date(),
      })
      .where(eq(exercise.id, exerciseId));
  }

  // Update muscle groups if provided
  if (muscleGroupIds !== undefined) {
    // Delete existing relationships
    await db.delete(exerciseMuscleGroup)
      .where(eq(exerciseMuscleGroup.exerciseId, exerciseId));

    // Create new relationships
    if (muscleGroupIds.length > 0) {
      await db.insert(exerciseMuscleGroup).values(
        muscleGroupIds.map((muscleGroupId: number) => ({
          exerciseId,
          muscleGroupId,
        })),
      );
    }
  }

  // Get updated exercise with muscle groups
  const updatedExercise = await db.query.exercise.findFirst({
    where: eq(exercise.id, exerciseId),
    with: {
      exerciseMuscleGroups: {
        with: {
          muscleGroup: true,
        },
      },
    },
  });

  if (!updatedExercise) {
    return c.json({ message: "Exercise not found" }, HttpStatusCodes.NOT_FOUND);
  }

  const result: SingleExerciseResponse = {
    id: updatedExercise.id,
    name: updatedExercise.name,
    muscleGroups: updatedExercise.exerciseMuscleGroups
      .filter(emg => emg.muscleGroup !== null)
      .map(emg => ({
        id: emg.muscleGroup!.id,
        name: emg.muscleGroup!.name,
      })),
    createdAt: updatedExercise.createdAt.toISOString(),
    updatedAt: updatedExercise.updatedAt.toISOString(),
  };

  return c.json(result, HttpStatusCodes.OK);
};
