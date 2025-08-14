import {ExerciseType} from './exercise-type.model';

export interface Workout {
  id: string;
  exerciseType: ExerciseType;
  durationMinutes: number;
  calories: number;
  intensity: number;
  fatigue: number;
  notes?: string;
  performedAt: string;
}
