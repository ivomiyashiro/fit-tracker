import { z } from "zod";

export const createWorkoutSessionSchema = z.object({
  workoutId: z.number({
    message: "Workout ID is required",
  }),
  completedAt: z.string().datetime().optional(),
  duration: z.number().min(0, {
    message: "Duration must be at least 0",
  }).optional(),
  notes: z.string().max(1000, {
    message: "Notes must be less than 1000 characters",
  }).optional(),
});

export type CreateWorkoutSessionRequest = z.infer<typeof createWorkoutSessionSchema>;
