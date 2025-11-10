-- Create temporary table with new schema
CREATE TABLE `workout_exercise_sets_new` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `workout_session_id` integer NOT NULL,
  `workout_exercise_id` integer,
  `reps` integer NOT NULL,
  `weight` integer NOT NULL,
  `rir` integer,
  `notes` text,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL,
  FOREIGN KEY (`workout_session_id`) REFERENCES `workout_sessions`(`id`) ON DELETE cascade,
  FOREIGN KEY (`workout_exercise_id`) REFERENCES `workout_exercises`(`id`)
);--> statement-breakpoint

-- Copy data from old table, assigning to first available session or 1
INSERT INTO `workout_exercise_sets_new` (id, workout_session_id, workout_exercise_id, reps, weight, rir, notes, created_at, updated_at)
SELECT 
  `id`,
  1 as workout_session_id,
  `workout_exercise_id`,
  `reps`,
  `weight`,
  `rir`,
  `notes`,
  `created_at`,
  `updated_at`
FROM `workout_exercise_sets`;--> statement-breakpoint

-- Drop old table
DROP TABLE `workout_exercise_sets`;--> statement-breakpoint

-- Rename new table
ALTER TABLE `workout_exercise_sets_new` RENAME TO `workout_exercise_sets`;