import { createRouter } from "@/server/lib/create-app";
import { requireAuth } from "@/server/middlewares";

import * as endpoints from "./endpoints";
import * as queries from "./handlers/queries";

const router = createRouter();

router.use(requireAuth);

router.openapi(endpoints.getPaginatedExercises, queries.getPaginatedExercises);

export default router;
