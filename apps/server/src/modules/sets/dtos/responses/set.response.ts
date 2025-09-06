import { z } from "zod";

import type { IPaginated } from "../../../../types/paginated.type.js";

export const setResponseSchema = z.object({
  id: z.number(),
  workoutExerciseId: z.number(),
  reps: z.number(),
  weight: z.number(),
  rir: z.number().nullable(),
  notes: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type SetResponse = z.infer<typeof setResponseSchema>;
export type SetPaginatedResponse = IPaginated<z.infer<typeof setResponseSchema>>;
