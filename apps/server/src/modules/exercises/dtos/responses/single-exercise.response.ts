import { z } from "zod";

const muscleGroupSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const singleExerciseResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  muscleGroups: z.array(muscleGroupSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type SingleExerciseResponse = z.infer<typeof singleExerciseResponseSchema>;
