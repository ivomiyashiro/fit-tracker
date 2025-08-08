import { z } from "zod";

export const setResponseSchema = z.object({
  id: z.number(),
  workoutExerciseId: z.number(),
  reps: z.number(),
  weight: z.number(),
  rir: z.number().nullable(),
  notes: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type SetResponse = z.infer<typeof setResponseSchema>;
