/**
 * Muscle Groups Module Routes
 *
 * - GET    /muscle-groups       - Get all muscle groups
 */

import { createRouter } from "@/server/lib/create-app.js";
import { requireAuth } from "@/server/middlewares/index.js";

import * as endpoints from "./endpoints/index.js";
import * as queries from "./handlers/queries/index.js";

const router = createRouter();

router.use(requireAuth);

router.openapi(endpoints.listMuscleGroups, queries.listMuscleGroups);

export default router;
