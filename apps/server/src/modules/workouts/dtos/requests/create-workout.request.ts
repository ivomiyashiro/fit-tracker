import { z } from "zod";

export const createWorkoutSchema = z.object({
  name: z.string()
    .min(1, {
      message: "Workout name is required",
    })
    .max(255, {
      message: "Workout name must be less than 255 characters",
    }),
  exerciseIds: z.array(z.number()).optional(),
});

export type CreateWorkoutRequest = z.infer<typeof createWorkoutSchema>;
