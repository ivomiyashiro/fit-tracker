import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { workoutExercise } from "./workout-exercise.schema";

export type WorkoutExerciseSet = typeof workoutExerciseSet.$inferSelect;

export const workoutExerciseSet = sqliteTable("workout_exercise_sets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  workoutExerciseId: integer("workout_exercise_id", { mode: "number" })
    .references(() => workoutExercise.id),
  reps: integer("reps").notNull(),
  weight: integer("weight").notNull(),
  rir: integer("rir"),
  notes: text("notes", { length: 1000 }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const workoutExerciseSetRelations = relations(workoutExerciseSet, ({ one }) => ({
  workoutExercise: one(workoutExercise, {
    fields: [workoutExerciseSet.workoutExerciseId],
    references: [workoutExercise.id],
  }),
}));
