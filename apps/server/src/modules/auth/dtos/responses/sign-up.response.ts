import type { z } from "zod";

import { userSchema } from "@/server/auth/dtos/responses/shared.response";

export const signUpResponseSchema = userSchema;

export type SignUpResponse = z.infer<typeof signUpResponseSchema>;
