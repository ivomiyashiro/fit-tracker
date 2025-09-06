import { serve } from "@hono/node-server";

import { runSeeds } from "@/server/db/seeds/index.js";

import app from "./app.js";
import env from "./env.js";

const port = env.PORT;

async function main() {
  await runSeeds();

  // eslint-disable-next-line no-console
  console.log(`Server is running on port http://localhost:${port}`);

  serve({
    fetch: app.fetch,
    port,
    hostname: "0.0.0.0",
  });
}

main();
