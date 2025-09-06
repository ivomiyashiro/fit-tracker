import { relations } from "drizzle-orm";
import { integer, sqliteTable } from "drizzle-orm/sqlite-core";

import { exercise } from "./exercise.schema.js";
import { workout } from "./workout.schema.js";

export type WorkoutExercise = typeof workoutExercise.$inferSelect;

export const workoutExercise = sqliteTable("workout_exercises", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  workoutId: integer("workout_id", { mode: "number" })
    .references(() => workout.id),
  exerciseId: integer("exercise_id", { mode: "number" })
    .references(() => exercise.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const workoutExerciseRelations = relations(workoutExercise, ({ one }) => ({
  workout: one(workout, {
    fields: [workoutExercise.workoutId],
    references: [workout.id],
  }),
  exercise: one(exercise, {
    fields: [workoutExercise.exerciseId],
    references: [exercise.id],
  }),
}));
