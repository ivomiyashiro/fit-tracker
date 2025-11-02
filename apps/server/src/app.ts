import { serveStatic } from "@hono/node-server/serve-static";
import path from "node:path";
import { fileURLToPath } from "node:url";

import auth from "@/server/auth/auth.index.js";
import exercises from "@/server/exercises/exercises.index.js";
import health from "@/server/health/health.index.js";
import configureOpenAPI from "@/server/lib/configure-open-api.js";
import createApp from "@/server/lib/create-app.js";
import muscleGroups from "@/server/muscle-groups/muscle-groups.index.js";
import sets from "@/server/sets/sets.index.js";
import workoutExercises from "@/server/workout-exercises/workout-exercises.index.js";
import workouts from "@/server/workouts/workouts.index.js";

import env from "./env.js";

const app = createApp();

configureOpenAPI(app);

const routes = [
  // public routes
  auth,
  health,

  // protected routes
  exercises,
  sets,
  muscleGroups,
  workoutExercises,
  workouts,
] as const;

routes.forEach((route) => {
  app.route("/api", route);
});

if (env.NODE_ENV === "production") {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const publicPath = path.join(__dirname, "..", "..", "..", "web", "dist");

  // Serve static assets (CSS, JS, images)
  app.use("/assets/*", serveStatic({ root: publicPath }));
  app.use("/favicon.ico", serveStatic({ root: publicPath }));

  // Serve index.html for all non-API routes (SPA fallback)
  app.get("*", serveStatic({
    root: publicPath,
    rewriteRequestPath: () => "/index.html",
  }));
}

export type AppType = typeof routes[number];

export default app;
