import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "./schemas";

const db = drizzle({
  client: createClient({
    url: "file:dev.db",
  }),
  schema,
  logger: true,
});

export default db;

export type database = typeof db;
