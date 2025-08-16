import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { exerciseMuscleGroup } from "./exercise-muscle-group.schema";
import { workoutExercise } from "./workout-exercise.schema";

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

export const exerciseRelations = relations(exercise, ({ many }) => ({
  exerciseMuscleGroups: many(exerciseMuscleGroup),
  workoutExercises: many(workoutExercise),
}));
