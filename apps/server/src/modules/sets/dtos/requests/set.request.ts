import { z } from "zod";

export const createSetSchema = z.object({
  workoutExerciseId: z.number({
    message: "Workout exercise ID is required",
  }),
  reps: z.number({
    message: "Reps is required",
  }).min(1, {
    message: "Reps must be at least 1",
  }),
  weight: z.number({
    message: "Weight is required",
  }).min(0, {
    message: "Weight must be at least 0",
  }),
  rir: z.number().optional(),
  notes: z.string().max(1000, {
    message: "Notes must be less than 1000 characters",
  }).optional(),
});

export type CreateSetRequest = z.infer<typeof createSetSchema>;

export const updateSetSchema = z.object({
  reps: z.number().min(1, {
    message: "Reps must be at least 1",
  }).optional(),
  weight: z.number().min(0, {
    message: "Weight must be at least 0",
  }).optional(),
  rir: z.number().optional(),
  notes: z.string().max(1000, {
    message: "Notes must be less than 1000 characters",
  }).optional(),
});

export type UpdateSetRequest = z.infer<typeof updateSetSchema>;
