import { z } from "zod";

export const createExerciseSchema = z.object({
  name: z.string()
    .min(1, {
      message: "Exercise name is required",
    })
    .max(255, {
      message: "Exercise name must be less than 255 characters",
    }),
  muscleGroupIds: z.array(z.number())
    .min(1, {
      message: "At least one muscle group is required",
    }),
});

export type CreateExerciseRequest = z.infer<typeof createExerciseSchema>;
