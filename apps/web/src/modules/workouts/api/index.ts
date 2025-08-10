import type {
  CreateWorkoutExerciseSetRequest,
  CreateWorkoutExerciseSetResponse,
  CreateWorkoutRequest,
  CreateWorkoutResponse,
  DeleteWorkoutsRequest,
  GetWorkoutByIdResponse,
  GetWorkoutExerciseSetsResponse,
  GetWorkoutsResponse,
  UpdateWorkoutExerciseSetRequest,
  UpdateWorkoutExerciseSetResponse,
  UpdateWorkoutRequest,
  UpdateWorkoutResponse,
} from "@fit-tracker/api-client";

import { httpClient } from "@/web/lib/http-client";

class WorkoutService {
  async getWorkoutById(workoutId: number): Promise<GetWorkoutByIdResponse> {
    return await httpClient.get<GetWorkoutByIdResponse>(`/workouts/${workoutId}`);
  }

  async getWorkouts(): Promise<GetWorkoutsResponse> {
    return await httpClient.get<GetWorkoutsResponse>(`/workouts`);
  }

  async createWorkout(workout: CreateWorkoutRequest): Promise<CreateWorkoutResponse> {
    return await httpClient.post<CreateWorkoutRequest, CreateWorkoutResponse>(`/workouts`, workout);
  }

  async deleteWorkoutById(workoutId: number): Promise<void> {
    return await httpClient.delete(`/workouts/${workoutId}`);
  }

  async deleteWorkouts(workoutIds: DeleteWorkoutsRequest): Promise<void> {
    return await httpClient.delete(`/workouts`, workoutIds);
  }

  async updateWorkout(
    workoutId: number,
    workout: UpdateWorkoutRequest,
  ): Promise<UpdateWorkoutResponse> {
    return await httpClient.put<UpdateWorkoutRequest, UpdateWorkoutResponse>(
      `/workouts/${workoutId}`,
      workout,
    );
  }

  async getWorkoutExerciseSets(
    workoutId: number,
    workoutExerciseId: number,
    pagination?: {
      cursor: number;
      limit: number;
    },
  ): Promise<GetWorkoutExerciseSetsResponse> {
    return await httpClient.get<GetWorkoutExerciseSetsResponse>(
      `/workouts/${workoutId}/workout-exercises/${workoutExerciseId}/sets`,
      pagination
        ? {
            query: {
              cursor: pagination.cursor.toString(),
              limit: pagination.limit.toString(),
            },
          }
        : {},
    );
  }

  async createWorkoutExerciseSet(
    workoutId: number,
    workoutExerciseId: number,
    set: CreateWorkoutExerciseSetRequest,
  ): Promise<CreateWorkoutExerciseSetResponse> {
    return await httpClient.post<CreateWorkoutExerciseSetRequest, CreateWorkoutExerciseSetResponse>(
      `/workouts/${workoutId}/workout-exercises/${workoutExerciseId}/sets`,
      set,
    );
  }

  async updateWorkoutExerciseSet(
    workoutId: number,
    workoutExerciseId: number,
    setId: number,
    set: UpdateWorkoutExerciseSetRequest,
  ): Promise<UpdateWorkoutExerciseSetResponse> {
    return await httpClient.put<UpdateWorkoutExerciseSetRequest, UpdateWorkoutExerciseSetResponse>(
      `/workouts/${workoutId}/workout-exercises/${workoutExerciseId}/sets/${setId}`,
      set,
    );
  }

  async deleteWorkoutExerciseSet(
    workoutId: number,
    workoutExerciseId: number,
    setId: number,
  ): Promise<void> {
    return await httpClient.delete(
      `/workouts/${workoutId}/workout-exercises/${workoutExerciseId}/sets/${setId}`,
    );
  }
}

export const workoutService = new WorkoutService();
