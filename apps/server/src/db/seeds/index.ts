import db from "@/server/db/index.js";
import * as seeds from "@/server/db/seeds/inserts/index.js";

export async function runSeeds() {
  await seeds.muscleGroups(db);
  await seeds.exercises(db);
  await seeds.exerciseMuscleGroups(db);
}
