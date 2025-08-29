import { serve } from "bun";

import { runSeeds } from "@/server/db/seeds";
import { runMigrations } from "@/server/utils/run-migrations";

import app from "./app";
import env from "./env";

const port = env.PORT;

await runMigrations();
await runSeeds();

// eslint-disable-next-line no-console
console.log(`Server is running on port http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});

