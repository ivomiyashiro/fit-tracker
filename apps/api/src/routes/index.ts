/* eslint-disable ts/no-redeclare */
import type { AppOpenAPI } from "@/api/lib/types";

import { BASE_PATH } from "@/api/lib/constants";
import createRouter from "@/api/lib/create-app";

import index from "./index.route";
import tasks from "./tasks/tasks.index";

export function registerRoutes(app: AppOpenAPI) {
  return app
    .route("/", index)
    .route("/", tasks);
}

// stand alone router type used for api client
export const router = registerRoutes(
  createRouter().basePath(BASE_PATH),
);
export type router = typeof router;
