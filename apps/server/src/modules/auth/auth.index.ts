import { createRouter } from "@/server/lib/create-app";

import * as endpoints from "./endpoints";
import * as mutations from "./handlers/mutations";
import * as queries from "./handlers/queries";

const router = createRouter()
  .openapi(endpoints.signIn, mutations.signIn)
  .openapi(endpoints.signUp, mutations.signUp)
  .openapi(endpoints.signOut, mutations.signOut)
  .openapi(endpoints.getSession, queries.getSession);

export default router;
