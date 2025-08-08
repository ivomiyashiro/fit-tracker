import { createRouter } from "@/server/lib/create-app";
import { requireAuth } from "@/server/middlewares";

import * as endpoints from "./endpoints";
import * as mutations from "./handlers/mutations";
import * as queries from "./handlers/queries";

const router = createRouter();

router.use(requireAuth);

router.openapi(endpoints.getPaginatedSets, queries.getPaginatedSets);
router.openapi(endpoints.createSet, mutations.createSet);
router.openapi(endpoints.getOneSet, queries.getOneSet);
router.openapi(endpoints.updateSet, mutations.updateSet);
router.openapi(endpoints.deleteSet, mutations.deleteSet);

export default router;
