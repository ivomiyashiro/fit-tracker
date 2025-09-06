import { defineConfig } from "drizzle-kit";

import env from "./src/env";

export default defineConfig({
  dialect: "turso",
  schema: "./src/db/schemas/**/*.schema.ts",
  out: "./src/db/migrations",
  dbCredentials: {
    url: env.DATABASE_URL,
    authToken: env.DATABASE_TOKEN,
  },
});
