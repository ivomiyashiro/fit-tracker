import { z } from "zod";

export const signUpRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

export type SignUpRequest = z.infer<typeof signUpRequestSchema>;
