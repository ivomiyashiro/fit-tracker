import { createRouter } from "@/server/lib/create-app";

import * as endpoints from "./endpoints";
import * as mutations from "./handlers/mutations";
import * as queries from "./handlers/queries";

const router = createRouter()
  .openapi(endpoints.listWorkouts, queries.listWorkouts)
  .openapi(endpoints.createWorkout, mutations.createWorkout);
  // .openapi(endpoints.getOne, queries.getOne)
  // .openapi(endpoints.update, mutations.update)
  // .openapi(endpoints.remove, mutations.remove);

export default router;
