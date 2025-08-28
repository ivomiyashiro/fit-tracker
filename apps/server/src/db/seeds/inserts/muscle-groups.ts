import type { database } from "@/server/db";

import { muscleGroup } from "@/server/db/schemas";
import muscleGroups from "@/server/db/seeds/data/muscle-groups.json";

export default async function seed(db: database) {
  const existingCount = await db.select({ count: muscleGroup.id }).from(muscleGroup).limit(1);

  if (existingCount.length > 0) {
    return;
  }

  await db.insert(muscleGroup).values(muscleGroups);
}
