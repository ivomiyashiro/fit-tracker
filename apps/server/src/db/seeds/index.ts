import db from "@/server/db";
import * as seeds from "@/server/db/seeds/inserts";

async function runSeeds() {
  await seeds.muscleGroups(db);
  await seeds.exercises(db);
  await seeds.exerciseMuscleGroups(db);
}

await runSeeds();
