import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import db from "@/server/db";
import { account, session, user, verification } from "@/server/db/schemas";

export const auth = betterAuth({
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
  trustedOrigins: ["http://localhost:3030"],
});
