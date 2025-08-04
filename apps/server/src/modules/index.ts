/* eslint-disable ts/no-redeclare */
import type { AppOpenAPI } from "@/server/lib/types";

import { BASE_PATH } from "@/server/lib/constants";
import createRouter from "@/server/lib/create-app";

import workouts from "./workouts/workouts.index";

export function registerRoutes(app: AppOpenAPI) {
  return app
    .route("/", workouts);
}

// stand alone router type used for api client
export const router = registerRoutes(
  createRouter().basePath(BASE_PATH),
);
export type router = typeof router;
