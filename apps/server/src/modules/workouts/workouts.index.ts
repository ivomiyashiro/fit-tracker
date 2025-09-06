import { createRouter } from "@/server/lib/create-app.js";
import { requireAuth } from "@/server/middlewares/index.js";

import * as endpoints from "./endpoints/index.js";
import * as mutations from "./handlers/mutations/index.js";
import * as queries from "./handlers/queries/index.js";

const router = createRouter();

router.use(requireAuth);

router.openapi(endpoints.listWorkouts, queries.listWorkouts);
router.openapi(endpoints.createWorkout, mutations.createWorkout);
router.openapi(endpoints.getOneWorkout, queries.getOneWorkout);
router.openapi(endpoints.updateWorkout, mutations.updateWorkout);
router.openapi(endpoints.bulkDeleteWorkout, mutations.bulkDeleteWorkout);

export default router;
