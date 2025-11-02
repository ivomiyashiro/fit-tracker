import { z } from "zod";

const sessionInfoSchema = z.object({
  id: z.number(),
  workoutName: z.string(),
  completedAt: z.string().nullable(),
  duration: z.number(),
});

const statsSchema = z.object({
  totalSets: z.number(),
  totalVolume: z.number(),
  exercisesCompleted: z.number(),
});

const exerciseBreakdownSchema = z.object({
  exerciseName: z.string(),
  sets: z.number(),
  volume: z.number(),
  avgReps: z.number(),
  avgWeight: z.number(),
});

export const workoutSessionSummarySchema = z.object({
  session: sessionInfoSchema,
  stats: statsSchema,
  exerciseBreakdown: z.array(exerciseBreakdownSchema),
});

export type WorkoutSessionSummaryResponse = z.infer<typeof workoutSessionSummarySchema>;
