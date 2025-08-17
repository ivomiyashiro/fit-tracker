import { z } from "zod";

export const setPaginatedResponseSchema = z.object({
  data: z.array(z.object({
    id: z.number(),
    workoutExerciseId: z.number(),
    reps: z.number(),
    weight: z.number(),
    rir: z.number().nullable(),
    notes: z.string().nullable(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

export type SetPaginatedResponse = z.infer<typeof setPaginatedResponseSchema>;
