import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { z } from "zod";

import { notFoundSchema } from "@/server/lib/constants.js";

const tags = ["Workouts"];

const nextWorkoutResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  order: z.number(),
  workoutExercises: z.array(z.object({
    id: z.number(),
    order: z.number(),
    exercise: z.object({
      id: z.number(),
      name: z.string(),
      muscleGroups: z.array(z.object({
        id: z.number(),
        name: z.string(),
      })),
    }),
  })),
  lastSession: z.object({
    id: z.number(),
    completedAt: z.string(),
  }).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const getNextWorkout = createRoute({
  path: "/workouts/next",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      nextWorkoutResponseSchema,
      "The next workout to perform",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "No workouts found",
    ),
  },
});

export type GetNextWorkoutRoute = typeof getNextWorkout;
