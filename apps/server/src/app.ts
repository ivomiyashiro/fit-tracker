import auth from "@/server/auth/auth.index";
import configureOpenAPI from "@/server/lib/configure-open-api";
import createApp from "@/server/lib/create-app";
import workoutExercises from "@/server/workout-exercises/workout-exercises.index";
import workouts from "@/server/workouts/workouts.index";

const app = createApp();

configureOpenAPI(app);

const routes = [
  auth,
  workouts,
  workoutExercises,
] as const;

routes.forEach((route) => {
  app.route("/", route);
});

export type AppType = typeof routes[number];

export default app;
