import { apiClient } from "@/web/lib/api-client";

class WorkoutExerciseService {
  async deleteWorkoutExercise(workoutExerciseIds: number[]): Promise<void> {
    return await apiClient.delete(`/workout-exercises`, workoutExerciseIds);
  }

  async reorderWorkoutExercises(
    workoutExerciseId: number,
    exercises: { id: number; order: number }[],
  ): Promise<void> {
    return await apiClient.patch(`/workout-exercises/${workoutExerciseId}/reorder`, {
      exercises,
    });
  }
}

export const workoutExerciseService = new WorkoutExerciseService();
