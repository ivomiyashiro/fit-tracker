import type { z } from "zod";

import { createWorkoutSchema } from "./create-workout.request.js";

export const updateWorkoutSchema = createWorkoutSchema.partial();

export type UpdateWorkoutRequest = z.infer<typeof updateWorkoutSchema>;
