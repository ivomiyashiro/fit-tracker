import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { WorkoutExercise } from "@/server/db/schemas";
import type { AppRouteHandler } from "@/server/lib/types";
import type { WorkoutExerciseWithExercise } from "@/server/modules/workouts/utils";
import type { WorkoutResponse } from "@/server/workouts/dtos/responses";
import type { UpdateRoute } from "@/server/workouts/endpoints";

import db from "@/server/db";
import { workout, workoutExercise } from "@/server/db/schemas";
import { getExercisesWithMuscleGroups, mapWorkoutExercisesToResponse } from "@/server/modules/workouts/utils";

export const updateWorkout: AppRouteHandler<UpdateRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const { name, exerciseIds = [] } = c.req.valid("json");
  const userId = c.get("auth").user.id;

  const existingWorkout = await db.query.workout.findFirst({
    where: eq(workout.id, id),
  });

  if (!existingWorkout || existingWorkout.userId !== userId) {
    return c.json({ message: "Workout not found" }, HttpStatusCodes.NOT_FOUND);
  }

  const [updatedWorkout] = await Promise.all([
    db.update(workout)
      .set({
        name,
        updatedAt: new Date(),
      })
      .where(eq(workout.id, id))
      .returning(),
    db.delete(workoutExercise)
      .where(eq(workoutExercise.workoutId, id)),
  ]);

  let newWorkoutExercises: WorkoutExercise[] = [];
  let workoutExercisesResponse: WorkoutExerciseWithExercise[] = [];

  if (exerciseIds.length > 0) {
    // Create new workout exercises and fetch exercise data in parallel
    const [workoutExercisesResult, exercisesWithMuscleGroups] = await Promise.all([
      db.insert(workoutExercise).values(
        exerciseIds.map((exerciseId: number) => ({
          workoutId: id,
          exerciseId,
        })),
      ).returning(),
      getExercisesWithMuscleGroups(exerciseIds),
    ]);

    newWorkoutExercises = workoutExercisesResult;
    workoutExercisesResponse = mapWorkoutExercisesToResponse(newWorkoutExercises, exercisesWithMuscleGroups);
  }

  const result: WorkoutResponse = {
    id: updatedWorkout[0].id,
    name: updatedWorkout[0].name,
    workoutExercises: workoutExercisesResponse,
    createdAt: updatedWorkout[0].createdAt.toISOString(),
    updatedAt: updatedWorkout[0].updatedAt.toISOString(),
  };

  return c.json(result, HttpStatusCodes.OK);
};
