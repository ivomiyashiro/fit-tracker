import { z } from "zod";

export const updateWorkoutSessionSchema = z.object({
  completedAt: z.string().optional(),
  duration: z.number().optional(),
  notes: z.string().optional(),
}).refine(
  data => Object.keys(data).length > 0,
  { message: "At least one field must be provided for update" },
);

export type UpdateWorkoutSessionRequest = z.infer<typeof updateWorkoutSessionSchema>;
