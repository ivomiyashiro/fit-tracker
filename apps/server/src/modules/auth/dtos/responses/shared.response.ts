import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().nullable(),
});

export const sessionSchema = z.object({
  id: z.string(),
  token: z.string(),
});

export type User = z.infer<typeof userSchema>;
export type Session = z.infer<typeof sessionSchema>;
