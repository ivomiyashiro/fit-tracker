import { z } from "zod";

export function generatePaginatedSchema<T>(schema: z.ZodType<T>) {
  return z.object({
    data: z.array(schema),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      totalPages: z.number(),
    }),
  });
}
