import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "@/web/lib/router/__root";
import { PrivateRouteGuard } from "@/web/lib/auth/guards";
import { AppLayout } from "@/web/components/layouts/app.layout";
import WorkoutsListPage from "@/web/modules/workouts/pages/workouts-list.page";
import WorkoutPage from "@/web/modules/workouts/pages/workout.page";
import AddExerciseToWorkoutPage from "@/web/modules/workouts/pages/add-exercise-to-workout.page";
import CreateWorkoutPage from "@/web/modules/workouts/pages/create-workout.page";
import WorkoutExerciseSetsPage from "@/web/modules/workouts/pages/workout-exercise-sets.page";
import UpdateWorkoutExerciseSetPage from "@/web/modules/workouts/pages/update-workout-exercise-set.page";

const workoutsBaseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/workouts",
  component: () => (
    <PrivateRouteGuard>
      <AppLayout />
    </PrivateRouteGuard>
  ),
});

const workoutsListRoute = createRoute({
  getParentRoute: () => workoutsBaseRoute,
  path: "/",
  component: WorkoutsListPage,
});

const workoutRoute = createRoute({
  getParentRoute: () => workoutsBaseRoute,
  path: "$workoutId",
  component: WorkoutPage,
});

const addExercisesRoute = createRoute({
  getParentRoute: () => workoutsBaseRoute,
  path: "$workoutId/add-exercises",
  component: AddExerciseToWorkoutPage,
});

const createWorkoutRoute = createRoute({
  getParentRoute: () => workoutsBaseRoute,
  path: "create",
  component: CreateWorkoutPage,
});

const workoutExerciseSetsRoute = createRoute({
  getParentRoute: () => workoutsBaseRoute,
  path: "$workoutId/workout-exercises/$workoutExerciseId/sets",
  component: WorkoutExerciseSetsPage,
});

const updateWorkoutExerciseSetRoute = createRoute({
  getParentRoute: () => workoutsBaseRoute,
  path: "$workoutId/workout-exercises/$workoutExerciseId/sets/$setId/edit",
  component: UpdateWorkoutExerciseSetPage,
});

export const routes = [
  workoutsBaseRoute.addChildren([
    workoutsListRoute,
    workoutRoute,
    addExercisesRoute,
    createWorkoutRoute,
    workoutExerciseSetsRoute,
    updateWorkoutExerciseSetRoute,
  ]),
];


