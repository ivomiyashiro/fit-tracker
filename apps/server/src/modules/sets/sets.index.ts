import { createRouter } from "@/server/lib/create-app.js";
import { requireAuth } from "@/server/middlewares/index.js";

import * as endpoints from "./endpoints/index.js";
import * as mutations from "./handlers/mutations/index.js";
import * as queries from "./handlers/queries/index.js";

const router = createRouter();

router.use(requireAuth);

router.openapi(endpoints.getPaginatedSets, queries.getPaginatedSets);
router.openapi(endpoints.createSet, mutations.createSet);
router.openapi(endpoints.getOneSet, queries.getOneSet);
router.openapi(endpoints.updateSet, mutations.updateSet);
router.openapi(endpoints.deleteSet, mutations.deleteSet);

export default router;
