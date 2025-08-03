import type { database } from "../../index";

import { muscleGroup } from "../../schemas";
import muscleGroups from "../data/muscle-groups.json";

export default async function seed(db: database) {
  await db.insert(muscleGroup).values(muscleGroups);
}
