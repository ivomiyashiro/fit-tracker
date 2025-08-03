import db from "@/server/db";
import * as seeds from "@/server/db/seeds/inserts";

await seeds.exercises(db);
await seeds.muscleGroups(db);
await seeds.exerciseMuscleGroups(db);
