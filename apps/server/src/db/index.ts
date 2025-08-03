import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

const db = drizzle({
  client: createClient({
    url: "file:dev.db",
  }),
  logger: true,
});

export default db;

export type database = typeof db;
