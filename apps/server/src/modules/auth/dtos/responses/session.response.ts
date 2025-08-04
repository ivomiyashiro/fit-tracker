import { z } from "zod";

import { sessionSchema, userSchema } from "@/server/auth/dtos/responses/shared.response";

export const sessionResponseSchema = z.object({
  user: userSchema.nullable(),
  session: sessionSchema.nullable(),
});

export type SessionResponse = z.infer<typeof sessionResponseSchema>;
