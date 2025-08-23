import { apiClient } from "@/web/lib/api-client";

class WorkoutExerciseService {
  async deleteWorkoutExercise(workoutExerciseIds: number[]): Promise<void> {
    return await apiClient.delete(`/workout-exercises`, workoutExerciseIds);
  }
}

export const workoutExerciseService = new WorkoutExerciseService();
