import { z } from "zod";

export const workoutResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  workoutExercises: z.array(z.object({
    id: z.number(),
    order: z.number().optional(),
    exercise: z.object({
      id: z.number(),
      name: z.string(),
      muscleGroups: z.array(z.object({
        id: z.number(),
        name: z.string(),
      })),
    }),
    createdAt: z.string(),
    updatedAt: z.string(),
  })),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type WorkoutResponse = z.infer<typeof workoutResponseSchema>;
