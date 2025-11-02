import { z } from "zod";

export const workoutSessionResponseSchema = z.object({
  id: z.number(),
  workoutId: z.number(),
  completedAt: z.string().nullable(),
  duration: z.number().nullable(),
  notes: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type WorkoutSessionResponse = z.infer<typeof workoutSessionResponseSchema>;
