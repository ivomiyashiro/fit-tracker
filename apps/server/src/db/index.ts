import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import env from "@/server/env";

import * as schema from "./schemas";

const db = drizzle({
  client: createClient({
    url: env.DATABASE_URL,
  }),
  schema,
  logger: env.NODE_ENV === "development",
});

export default db;

export type database = typeof db;
