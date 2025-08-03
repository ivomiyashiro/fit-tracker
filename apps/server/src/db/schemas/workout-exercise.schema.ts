import { integer, sqliteTable } from "drizzle-orm/sqlite-core";

import { exercise } from "./exercise.schema";
import { workout } from "./workout.schema";

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
