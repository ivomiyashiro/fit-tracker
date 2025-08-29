import { migrate } from "drizzle-orm/libsql/migrator";

import db from "@/server/db";

export async function runMigrations() {
  await migrate(db, { migrationsFolder: "./src/db/migrations" });
}
