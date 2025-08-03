import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export type Exercise = typeof exercise.$inferSelect;

export const exercise = sqliteTable("exercises", {
  id: integer("id", { mode: "number" })
    .primaryKey({ autoIncrement: true }),
  name: text("name", { length: 255 }).notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});
