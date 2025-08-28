import type { database } from "@/server/db";

import { exercise } from "@/server/db/schemas";
import exercises from "@/server/db/seeds/data/exercises.json";

export default async function seed(db: database) {
  const existingCount = await db.select({ count: exercise.id }).from(exercise).limit(1);

  if (existingCount.length > 0) {
    return;
  }

  await db.insert(exercise).values(exercises);
}
