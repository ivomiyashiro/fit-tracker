import { createRouter } from "@/server/lib/create-app.js";
import { requireAuth } from "@/server/middlewares/index.js";

import * as endpoints from "./endpoints/index.js";
import * as queries from "./handlers/queries/index.js";

const router = createRouter();

router.use(requireAuth);

router.openapi(endpoints.getPaginatedExercises, queries.getPaginatedExercises);

export default router;
