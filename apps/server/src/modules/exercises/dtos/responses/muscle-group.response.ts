import { z } from "zod";

export const muscleGroupResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type MuscleGroupResponse = z.infer<typeof muscleGroupResponseSchema>;
