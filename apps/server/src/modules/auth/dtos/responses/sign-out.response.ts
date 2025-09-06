import { z } from "zod";

export const signOutResponseSchema = z.object({
  message: z.string(),
});

export type SignOutResponse = z.infer<typeof signOutResponseSchema>;
