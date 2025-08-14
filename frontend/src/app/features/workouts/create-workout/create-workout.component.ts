// create-workout.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {WorkoutService} from "../../../core/services/workout.service";
import {ExerciseType} from "../../../core/models/exercise-type.model";
import {CreateWorkoutDTO} from "../../../core/models/create-workout.model";
import {Workout} from "../../../core/models/workout.model";
import {TokenStorageService} from "../../../core/services/token-storage.service";
import {SuccessPopupComponent} from "../../../shared/components/success-popup/success-popup.component";

@Component({
  selector: 'app-create-workout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SuccessPopupComponent],
  templateUrl: './create-workout.component.html',
  styleUrls: ['./create-workout.component.css']
})
export class CreateWorkoutComponent implements OnInit {
  workoutForm!: FormGroup;
  isLoading = false;
  globalError = '';
  showSuccessPopup = false;

  exerciseTypes = Object.values(ExerciseType);

  constructor(
      private fb: FormBuilder,
      private router: Router,
      private workoutService: WorkoutService,
      private tokenService: TokenStorageService ,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.setDefaultDateTime();
  }

  private initializeForm(): void {
    this.workoutForm = this.fb.group({
      exerciseType: ['', [Validators.required]],
      durationMinutes: ['', [Validators.required, Validators.min(1), Validators.max(600)]],
      calories: ['', [Validators.min(0), Validators.max(3000)]],
      intensity: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      fatigue: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      performedAt: ['', [Validators.required]],
      notes: ['', [Validators.maxLength(2000)]]
    });
  }

  private setDefaultDateTime(): void {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const defaultDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    this.workoutForm.patchValue({ performedAt: defaultDateTime });
  }

  onSubmit(): void {
    if (this.workoutForm.valid) {
      this.isLoading = true;
      this.globalError = '';

      const workoutData: CreateWorkoutDTO = {
        username: this.tokenService.getUsername() ?? '',
        exerciseType: this.workoutForm.value.exerciseType as ExerciseType,
        durationMinutes: parseInt(this.workoutForm.value.durationMinutes),
        calories: this.workoutForm.value.calories ? parseInt(this.workoutForm.value.calories) : 0,
        intensity: parseInt(this.workoutForm.value.intensity),
        fatigue: parseInt(this.workoutForm.value.fatigue),
        performedAt: new Date(this.workoutForm.value.performedAt).toISOString(),
        notes: this.workoutForm.value.notes || ''
      };

      this.workoutService.createWorkout(workoutData).subscribe({
        next: (workout: Workout) => {
          this.isLoading = false;
          this.showSuccessPopup = true;
          this.resetForm();
        },
        error: (error: { error: { message: string; }; }) => {
          this.globalError = error.error?.message || 'An error occurred while creating the workout';
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.workoutForm.controls).forEach(key => {
      const control = this.workoutForm.get(key);
      control?.markAsTouched();
    });
  }

  getCurrentDateTime(): string {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  }

  goBack(): void {
    this.router.navigate(['/workouts']);
  }

  getFieldError(fieldName: string): string {
    const field = this.workoutForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }
      if (field.errors['min']) {
        return `${this.getFieldDisplayName(fieldName)} must be at least ${field.errors['min'].min}`;
      }
      if (field.errors['max']) {
        return `${this.getFieldDisplayName(fieldName)} cannot exceed ${field.errors['max'].max}`;
      }
      if (field.errors['maxlength']) {
        return `${this.getFieldDisplayName(fieldName)} cannot exceed ${field.errors['maxlength'].requiredLength} characters`;
      }
    }
    return '';
  }

  onPopupClose(): void {
    this.showSuccessPopup = false;
    this.router.navigate(['/workouts']);
  }

  get exerciseType() { return this.workoutForm.get('exerciseType'); }
  get durationMinutes() { return this.workoutForm.get('durationMinutes'); }
  get calories() { return this.workoutForm.get('calories'); }
  get performedAt() { return this.workoutForm.get('performedAt'); }
  get notes() { return this.workoutForm.get('notes'); }

  getExerciseTypeLabel(type: ExerciseType): string {
    const labels: { [key in ExerciseType]: string } = {
      [ExerciseType.CARDIO]: 'Cardio',
      [ExerciseType.STRENGTH]: 'Strength Training',
      [ExerciseType.FLEXIBILITY]: 'Flexibility',
      [ExerciseType.SPORTS]: 'Sports',
      [ExerciseType.OTHER]: 'Other'
    };
    return labels[type];
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      exerciseType: 'Exercise type',
      durationMinutes: 'Duration',
      calories: 'Calories',
      intensity: 'Intensity',
      fatigue: 'Fatigue level',
      performedAt: 'Workout date and time',
      notes: 'Notes'
    };
    return displayNames[fieldName] || fieldName;
  }

  private resetForm(): void {
    this.workoutForm.reset();

    this.workoutForm.patchValue({
      intensity: 5,
      fatigue: 5
    });

    this.setDefaultDateTime();

    Object.keys(this.workoutForm.controls).forEach(key => {
      const control = this.workoutForm.get(key);
      control?.setErrors(null);
      control?.markAsUntouched();
      control?.markAsPristine();
    });
  }
}
