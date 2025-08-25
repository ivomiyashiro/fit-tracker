import { serveStatic } from "@hono/node-server/serve-static";

import auth from "@/server/auth/auth.index";
import exercises from "@/server/exercises/exercises.index";
import configureOpenAPI from "@/server/lib/configure-open-api";
import createApp from "@/server/lib/create-app";
import sets from "@/server/sets/sets.index";
import workoutExercises from "@/server/workout-exercises/workout-exercises.index";
import workouts from "@/server/workouts/workouts.index";

const app = createApp();

configureOpenAPI(app);

const routes = [
  auth,
  workouts,
  workoutExercises,
  sets,
  exercises,
] as const;

routes.forEach((route) => {
  app.route("/api", route);
});

app.use("/*", serveStatic({ root: "./dist/public" }));
app.get("*", serveStatic({ path: "./dist/public/index.html" }));

export type AppType = typeof routes[number];

export default app;
