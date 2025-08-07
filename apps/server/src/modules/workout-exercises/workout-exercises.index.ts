import { createRouter } from "@/server/lib/create-app";
import { requireAuth } from "@/server/middlewares";

import * as endpoints from "./endpoints";
import * as mutations from "./handlers/mutations";

const router = createRouter();

router.use(requireAuth);

router.openapi(endpoints.deleteWorkoutExercise, mutations.deleteWorkoutExercise);

export default router;
