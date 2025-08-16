import { createRouter } from "@/server/lib/create-app";
import { requireAuth } from "@/server/middlewares";

import * as endpoints from "./endpoints";
import * as mutations from "./handlers/mutations";
import * as queries from "./handlers/queries";

const router = createRouter();

router.use(requireAuth);

router.openapi(endpoints.listWorkouts, queries.listWorkouts);
router.openapi(endpoints.createWorkout, mutations.createWorkout);
router.openapi(endpoints.getOneWorkout, queries.getOneWorkout);
router.openapi(endpoints.updateWorkout, mutations.updateWorkout);
router.openapi(endpoints.bulkDeleteWorkout, mutations.bulkDeleteWorkout);

export default router;
