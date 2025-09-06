import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { exerciseMuscleGroup } from "./exercise-muscle-group.schema.js";

export type MuscleGroup = typeof muscleGroup.$inferSelect;

export const muscleGroup = sqliteTable("muscle_groups", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name", { length: 255 }).notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const muscleGroupRelations = relations(muscleGroup, ({ many }) => ({
  exerciseMuscleGroups: many(exerciseMuscleGroup),
}));
