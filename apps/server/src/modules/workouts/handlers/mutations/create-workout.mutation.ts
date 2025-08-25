import * as HttpStatusCodes from "stoker/http-status-codes";

import type { WorkoutExercise } from "@/server/db/schemas";
import type { AppRouteHandler } from "@/server/lib/types";
import type { WorkoutExerciseWithExercise } from "@/server/modules/workouts/utils";
import type { WorkoutResponse } from "@/server/workouts/dtos/responses";
import type { CreateRoute } from "@/server/workouts/endpoints";

import db from "@/server/db";
import { workout, workoutExercise } from "@/server/db/schemas";
import { getExercisesWithMuscleGroups, mapWorkoutExercisesToResponse } from "@/server/modules/workouts/utils/exercise-utils";

export const createWorkout: AppRouteHandler<CreateRoute> = async (c) => {
  const { name, exerciseIds = [] } = c.req.valid("json");
  const userId = c.get("auth").user.id;

  // Create workout
  const [newWorkout] = await db.insert(workout).values({
    name,
    userId,
  }).returning();

  let newWorkoutExercises: WorkoutExercise[] = [];
  let workoutExercisesResponse: WorkoutExerciseWithExercise[] = [];

  if (exerciseIds.length > 0) {
    // Create workout exercises and get exercises with muscle groups in parallel
    const [workoutExercisesResult, exercisesWithMuscleGroups] = await Promise.all([
      db.insert(workoutExercise).values(
        exerciseIds.map(id => ({
          workoutId: newWorkout.id,
          exerciseId: id,
        })),
      ).returning(),
      getExercisesWithMuscleGroups(exerciseIds),
    ]);

    newWorkoutExercises = workoutExercisesResult;
    workoutExercisesResponse = mapWorkoutExercisesToResponse(newWorkoutExercises, exercisesWithMuscleGroups);
  }

  const result: WorkoutResponse = {
    id: newWorkout.id,
    name: newWorkout.name,
    workoutExercises: workoutExercisesResponse,
    createdAt: newWorkout.createdAt.toISOString(),
    updatedAt: newWorkout.updatedAt.toISOString(),
  };

  return c.json(result, HttpStatusCodes.CREATED);
};
