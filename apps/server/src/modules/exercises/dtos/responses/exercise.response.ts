import { z } from "zod";

export const exerciseResponseSchema = z.object({
  data: z.array(z.object({
    id: z.number(),
    name: z.string(),
    muscleGroups: z.array(z.object({
      id: z.number(),
      name: z.string(),
    })),
  })),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

export type ExerciseResponse = z.infer<typeof exerciseResponseSchema>;
