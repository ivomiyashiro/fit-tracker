import { z } from "zod";

export const reorderWorkoutsSchema = z.object({
  workouts: z.array(z.object({
    id: z.number({
      message: "Workout ID is required",
    }),
    order: z.number({
      message: "Order is required",
    }).min(1, {
      message: "Order must be at least 1",
    }),
  })),
});

export type ReorderWorkoutsRequest = z.infer<typeof reorderWorkoutsSchema>;
