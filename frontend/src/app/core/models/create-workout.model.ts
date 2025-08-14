import {ExerciseType} from './exercise-type.model';

export interface CreateWorkoutDTO {
  username: string;
  exerciseType: ExerciseType;
  durationMinutes: number;
  calories: number;
  intensity: number;
  fatigue: number;
  performedAt: string;
  notes?: string;
}
