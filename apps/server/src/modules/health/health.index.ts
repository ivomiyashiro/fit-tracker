import { createRouter } from "@/server/lib/create-app.js";

import * as endpoints from "./endpoints/index.js";
import * as handlers from "./handlers/queries/index.js";

const router = createRouter();

router.openapi(endpoints.checkHealth, handlers.getHealth);

export default router;
