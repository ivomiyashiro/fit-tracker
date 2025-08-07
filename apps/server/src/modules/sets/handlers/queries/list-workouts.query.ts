import { eq, inArray } from "drizzle-orm";

import type { AppRouteHandler } from "@/server/lib/types";
import type { WorkoutResponse } from "@/server/workouts/dtos/responses";
import type { ListRoute } from "@/server/workouts/endpoints";

import db from "@/server/db";
import { exercise, exerciseMuscleGroup, muscleGroup, workout, workoutExercise } from "@/server/db/schemas";

export const listWorkouts: AppRouteHandler<ListRoute> = async (c) => {
  const userId = c.get("auth").user.id;

  const workouts = await db.query.workout.findMany({
    with: {
      workoutExercises: true,
    },
    where: eq(workout.userId, userId),
  });

  const workoutIds = workouts.map(w => w.id);

  // Get all workout exercises for all workouts
  const allWorkoutExercises = await db.query.workoutExercise.findMany({
    where: inArray(workoutExercise.workoutId, workoutIds),
  });

  // Get all exercise IDs
  const exerciseIds = allWorkoutExercises
    .map(we => we.exerciseId)
    .filter((id): id is number => id !== null);

  // Get all exercises
  const exercises = await db.query.exercise.findMany({
    where: inArray(exercise.id, exerciseIds),
  });

  // Get exercise-muscle group relations
  const exerciseMuscleGroupRelations = await db.query.exerciseMuscleGroup.findMany({
    where: inArray(exerciseMuscleGroup.exerciseId, exerciseIds),
  });

  // Get all muscle group IDs
  const muscleGroupIds = exerciseMuscleGroupRelations
    .map(rel => rel.muscleGroupId)
    .filter((id): id is number => id !== null);

  // Get all muscle groups
  const muscleGroups = await db.query.muscleGroup.findMany({
    where: inArray(muscleGroup.id, muscleGroupIds),
  });

  // Create muscle group name lookup
  const muscleGroupMap = new Map(muscleGroups.map(mg => [mg.id, mg.name]));

  // Group muscle group IDs by exercise ID
  const exerciseToMuscleGroups = new Map<number, number[]>();
  exerciseMuscleGroupRelations.forEach((rel) => {
    if (rel.exerciseId !== null && rel.muscleGroupId !== null) {
      const existing = exerciseToMuscleGroups.get(rel.exerciseId) || [];
      existing.push(rel.muscleGroupId);
      exerciseToMuscleGroups.set(rel.exerciseId, existing);
    }
  });

  // Create exercise to muscle groups map
  const exerciseMuscleGroupMap = new Map<number, string[]>();
  exercises.forEach((ex) => {
    const muscleGroupIds = exerciseToMuscleGroups.get(ex.id) || [];
    const muscleGroupNames = muscleGroupIds
      .map(id => muscleGroupMap.get(id))
      .filter((name): name is string => name !== undefined);
    exerciseMuscleGroupMap.set(ex.id, muscleGroupNames);
  });

  // Group workout exercises by workout ID
  const workoutExercisesMap = new Map<number, typeof allWorkoutExercises>();
  allWorkoutExercises.forEach((we) => {
    if (we.workoutId !== null) {
      const existing = workoutExercisesMap.get(we.workoutId) || [];
      existing.push(we);
      workoutExercisesMap.set(we.workoutId, existing);
    }
  });

  const result: WorkoutResponse[] = workouts.map(workout => ({
    id: workout.id,
    name: workout.name,
    workoutExercises: (workoutExercisesMap.get(workout.id) || []).map(we => ({
      id: we.id,
      exercises: exercises.map(e => ({
        id: e.id,
        name: e.name,
        muscleGroups: exerciseMuscleGroupMap.get(e.id) || [],
      })),
      createdAt: we.createdAt.toISOString(),
      updatedAt: we.updatedAt.toISOString(),
    })),
    createdAt: workout.createdAt.toISOString(),
    updatedAt: workout.updatedAt.toISOString(),
  }));

  return c.json(result);
};
