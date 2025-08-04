import configureOpenAPI from "@/server/lib/configure-open-api";
import createApp from "@/server/lib/create-app";
import workouts from "@/server/modules/workouts/workouts.index";

const app = createApp();

configureOpenAPI(app);

const routes = [
  workouts,
] as const;

routes.forEach((route) => {
  app.route("/", route);
});

export type AppType = typeof routes[number];

export default app;
