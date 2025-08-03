import { integer, sqliteTable } from "drizzle-orm/sqlite-core";

import { exercise } from "./exercise.schema";
import { muscleGroup } from "./muscle-group.schema";

export type ExerciseMuscleGroup = typeof exerciseMuscleGroup.$inferSelect;

export const exerciseMuscleGroup = sqliteTable("exercise_muscle_groups", {
  exerciseId: integer("exercise_id", { mode: "number" })
    .references(() => exercise.id),
  muscleGroupId: integer("muscle_group_id", { mode: "number" })
    .references(() => muscleGroup.id),
});
