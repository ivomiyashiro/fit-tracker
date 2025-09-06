import type { z } from "zod";

import { userSchema } from "@/server/auth/dtos/responses/shared.response.js";

export const signInResponseSchema = userSchema;

export type SignInResponse = z.infer<typeof signInResponseSchema>;
