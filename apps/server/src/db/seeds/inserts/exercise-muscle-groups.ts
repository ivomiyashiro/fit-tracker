import type { database } from "@/server/db/index.js";

import { exercise, exerciseMuscleGroup, muscleGroup } from "@/server/db/schemas/index.js";
import exerciseMuscleGroupsData from "@/server/db/seeds/data/exercise-muscle-groups.json" with { type: "json" };

export default async function seed(db: database) {
  const existingCount = await db.select({ count: exerciseMuscleGroup.exerciseId }).from(exerciseMuscleGroup).limit(1);

  if (existingCount.length > 0) {
    return;
  }

  await db.transaction(async (tx) => {
    const exercises = await tx.select({ id: exercise.id, name: exercise.name }).from(exercise);
    const muscleGroups = await tx.select({ id: muscleGroup.id, name: muscleGroup.name }).from(muscleGroup);

    const relationships: Array<{ exerciseId: number; muscleGroupId: number }> = [];

    for (const relation of exerciseMuscleGroupsData) {
      const exerciseRecord = exercises.find(ex => ex.name === relation.exercise);

      if (!exerciseRecord) {
        console.warn(`Exercise "${relation.exercise}" not found in database`);
        continue;
      }

      for (const muscleGroupName of relation.muscleGroups) {
        const muscleGroupRecord = muscleGroups.find(mg => mg.name === muscleGroupName);

        if (!muscleGroupRecord) {
          console.warn(`Muscle group "${muscleGroupName}" not found in database`);
          continue;
        }

        relationships.push({
          exerciseId: exerciseRecord.id,
          muscleGroupId: muscleGroupRecord.id,
        });
      }
    }

    await tx.insert(exerciseMuscleGroup).values(relationships);
  });
}
