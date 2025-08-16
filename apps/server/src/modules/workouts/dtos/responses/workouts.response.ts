import { z } from "zod";

export const workoutResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  workoutExercises: z.array(z.object({
    id: z.number(),
    exercise: z.object({
      id: z.number(),
      name: z.string(),
      muscleGroups: z.array(z.string()),
    }),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type WorkoutResponse = z.infer<typeof workoutResponseSchema>;
