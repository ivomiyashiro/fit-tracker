import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import db from "@/server/db/index.js";
import { account, session, user, verification } from "@/server/db/schemas/index.js";
import env from "@/server/env.js";

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET || "your-secret-key-change-in-production",
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      user,
      account,
      session,
      verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  trustedOrigins: ["http://localhost:3030", "http://localhost:5173"],
});
