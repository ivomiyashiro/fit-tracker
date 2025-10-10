/* eslint-disable node/no-process-env */
import path from "node:path";
import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { z } from "zod";

expand(config({
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV === "test"
      ? ".env.test"
      : process.env.NODE_ENV === "production"
        ? ".env.production"
        : ".env",
  ),
}));

const EnvSchema = z.object({
  NODE_ENV: z.string().default("development"),
  VITE_API_URL: z.string().url(),
}).superRefine((input, ctx) => {
  if (input.NODE_ENV === "production" && !input.VITE_API_URL) {
    ctx.addIssue({
      code: z.ZodIssueCode.invalid_type,
      expected: "string",
      received: "undefined",
      path: ["VITE_API_URL"],
      message: "Must be set when NODE_ENV is 'production'",
    });
  }
});

export type env = z.infer<typeof EnvSchema>;

// eslint-disable-next-line ts/no-redeclare
const { data: env, error } = EnvSchema.safeParse(process.env);

if (error) {
  console.error("❌ Invalid env:");
  console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
  process.exit(1);
}

export default env!;
