import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import env from "@/server/env.js";

import * as schema from "./schemas/index.js";

const db = drizzle({
  client: createClient({
    url: env.DATABASE_URL,
    authToken: env.DATABASE_TOKEN,
  }),
  schema,
  logger: env.NODE_ENV === "development",
});

export default db;

export type database = typeof db;
