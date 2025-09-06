import { migrate } from "drizzle-orm/libsql/migrator";

import db from "@/server/db/index.js";
import env from "@/server/env.js";

export async function runMigrations() {
  const migrationsFolder = env.NODE_ENV === "production"
    ? "./apps/dist/src/db/migrations"
    : "./src/db/migrations";

  await migrate(db, { migrationsFolder });
}
