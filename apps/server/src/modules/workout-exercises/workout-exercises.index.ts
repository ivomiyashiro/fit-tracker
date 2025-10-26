import { createRouter } from "@/server/lib/create-app.js";
import { requireAuth } from "@/server/middlewares/index.js";

import * as endpoints from "./endpoints/index.js";
import * as mutations from "./handlers/mutations/index.js";

const router = createRouter();

router.use(requireAuth);

router.openapi(endpoints.deleteWorkoutExercise, mutations.deleteWorkoutExercise);
router.openapi(endpoints.reorderWorkoutExercises, mutations.reorderWorkoutExercises);

export default router;
