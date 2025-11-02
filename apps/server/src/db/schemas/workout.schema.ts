import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { user } from "./user.schema";
import { workoutExercise } from "./workout-exercise.schema";
import { workoutSession } from "./workout-session.schema";

export type Workout = typeof workout.$inferSelect;

export const workout = sqliteTable("workouts", {
  id: integer("id", { mode: "number" })
    .primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "no action" }),
  name: text("name", { length: 255 }).notNull(),
  order: integer("order", { mode: "number" }).notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const workoutRelations = relations(workout, ({ one, many }) => ({
  user: one(user, {
    fields: [workout.userId],
    references: [user.id],
  }),
  workoutExercises: many(workoutExercise),
  workoutSessions: many(workoutSession),
}));
