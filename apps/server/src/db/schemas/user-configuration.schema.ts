import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { user } from "./user.schema";

export type UserConfiguration = typeof userConfiguration.$inferSelect;

export const userConfiguration = sqliteTable("user_configurations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").references(() => user.id),
  restTimeInSeconds: integer("rest_time_in_seconds").default(120),
  weightUnit: text("weight_unit").default("kg"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});
