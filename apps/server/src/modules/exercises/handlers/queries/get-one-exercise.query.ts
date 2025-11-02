import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/server/lib/types.js";
import type { SingleExerciseResponse } from "@/server/modules/exercises/dtos/responses/index.js";
import type { GetOneRoute } from "@/server/modules/exercises/endpoints/index.js";

import db from "@/server/db/index.js";
import { exercise } from "@/server/db/schemas/index.js";

export const getOneExercise: AppRouteHandler<GetOneRoute> = async (c) => {
  const exerciseId = Number.parseInt(c.req.param("id"));

  const exerciseData = await db.query.exercise.findFirst({
    where: eq(exercise.id, exerciseId),
    with: {
      exerciseMuscleGroups: {
        with: {
          muscleGroup: true,
        },
      },
    },
  });

  if (!exerciseData) {
    return c.json({ message: "Exercise not found" }, HttpStatusCodes.NOT_FOUND);
  }

  const result: SingleExerciseResponse = {
    id: exerciseData.id,
    name: exerciseData.name,
    muscleGroups: exerciseData.exerciseMuscleGroups
      .filter(emg => emg.muscleGroup !== null)
      .map(emg => ({
        id: emg.muscleGroup!.id,
        name: emg.muscleGroup!.name,
      })),
    createdAt: exerciseData.createdAt.toISOString(),
    updatedAt: exerciseData.updatedAt.toISOString(),
  };

  return c.json(result, HttpStatusCodes.OK);
};
