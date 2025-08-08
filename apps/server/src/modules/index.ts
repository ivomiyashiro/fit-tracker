/* eslint-disable ts/no-redeclare */
import type { AppOpenAPI } from "@/server/lib/types";

import { BASE_PATH } from "@/server/lib/constants";
import createRouter from "@/server/lib/create-app";

import auth from "./auth/auth.index";
import sets from "./sets/sets.index";
import workoutExercises from "./workout-exercises/workout-exercises.index";
import workouts from "./workouts/workouts.index";

export function registerRoutes(app: AppOpenAPI) {
  return app
    .route("/", auth)
    .route("/", sets)
    .route("/", workouts)
    .route("/", workoutExercises);
}

// stand alone router type used for api client
export const router = registerRoutes(
  createRouter().basePath(BASE_PATH),
);
export type router = typeof router;
