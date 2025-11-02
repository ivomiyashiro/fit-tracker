import { z } from "zod";

const exerciseMuscleGroupSchema = z.object({
  id: z.number(),
  name: z.string(),
});

const exerciseSchema = z.object({
  id: z.number(),
  name: z.string(),
  muscleGroups: z.array(exerciseMuscleGroupSchema),
});

const workoutExerciseSchema = z.object({
  id: z.number(),
  order: z.number(),
  hasCompletedSets: z.boolean().optional(),
  exercise: exerciseSchema,
});

const workoutSchema = z.object({
  id: z.number(),
  name: z.string(),
  order: z.number(),
  workoutExercises: z.array(workoutExerciseSchema),
});

export const workoutSessionDetailSchema = z.object({
  id: z.number(),
  workoutId: z.number(),
  userId: z.string(),
  completedAt: z.string().nullable(),
  duration: z.number().nullable(),
  notes: z.string().nullable(),
  lastIncompleteExerciseIndex: z.number().optional(),
  workout: workoutSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type WorkoutSessionDetailResponse = z.infer<typeof workoutSessionDetailSchema>;
