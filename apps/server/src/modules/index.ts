/* eslint-disable ts/no-redeclare */
import type { AppOpenAPI } from "@/server/lib/types.js";

import { BASE_PATH } from "@/server/lib/constants.js";
import createRouter from "@/server/lib/create-app.js";

import auth from "./auth/auth.index.js";
import exercises from "./exercises/exercises.index.js";
import health from "./health/health.index.js";
import sets from "./sets/sets.index.js";
import workoutExercises from "./workout-exercises/workout-exercises.index.js";
import workouts from "./workouts/workouts.index.js";

export function registerRoutes(app: AppOpenAPI) {
  return app
    .route("/", auth)
    .route("/", exercises)
    .route("/", health)
    .route("/", sets)
    .route("/", workoutExercises)
    .route("/", workouts);
}

// stand alone router type used for api client
export const router = registerRoutes(
  createRouter().basePath(BASE_PATH),
);
export type router = typeof router;
