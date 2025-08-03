import type { database } from "../../index";

import { exercise, exerciseMuscleGroup, muscleGroup } from "../../schemas";
import exerciseMuscleGroupsData from "../data/exercise-muscle-groups.json";

export default async function seed(db: database) {
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
