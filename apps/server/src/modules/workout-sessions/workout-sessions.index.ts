import { createRouter } from "@/server/lib/create-app.js";
import { requireAuth } from "@/server/middlewares/index.js";

import * as endpoints from "./endpoints/index.js";
import * as mutations from "./handlers/mutations/index.js";
import * as queries from "./handlers/queries/index.js";

const router = createRouter();

router.use(requireAuth);

router.openapi(endpoints.getWorkoutSessions, queries.getWorkoutSessions);
router.openapi(endpoints.getActiveWorkoutSession, queries.getActiveWorkoutSession);
router.openapi(endpoints.getWorkoutSession, queries.getWorkoutSession);
router.openapi(endpoints.getWorkoutSessionSummary, queries.getWorkoutSessionSummary);
router.openapi(endpoints.createWorkoutSession, mutations.createWorkoutSession);
router.openapi(endpoints.updateWorkoutSession, mutations.updateWorkoutSession);

export default router;
