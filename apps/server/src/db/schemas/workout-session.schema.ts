import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { user } from "./user.schema";
import { workout } from "./workout.schema";

export type WorkoutSession = typeof workoutSession.$inferSelect;
export type InsertWorkoutSession = typeof workoutSession.$inferInsert;

export const workoutSession = sqliteTable("workout_sessions", {
  id: integer("id", { mode: "number" })
    .primaryKey({ autoIncrement: true }),
  workoutId: integer("workout_id", { mode: "number" })
    .notNull()
    .references(() => workout.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  completedAt: integer("completed_at", { mode: "timestamp" })
    .notNull(),
  duration: integer("duration"),
  notes: text("notes", { length: 1000 }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const workoutSessionRelations = relations(workoutSession, ({ one }) => ({
  workout: one(workout, {
    fields: [workoutSession.workoutId],
    references: [workout.id],
  }),
  user: one(user, {
    fields: [workoutSession.userId],
    references: [user.id],
  }),
}));
