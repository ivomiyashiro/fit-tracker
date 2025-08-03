import type { database } from "../../index";

import { exercise } from "../../schemas";
import exercises from "../data/exercises.json";

export default async function seed(db: database) {
  await db.insert(exercise).values(exercises);
}
