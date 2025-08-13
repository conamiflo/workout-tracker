import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router} from '@angular/router';

@Component({
  selector: 'app-create-workout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-workout.component.html',
  styleUrls: ['./create-workout.component.css']
})
export class CreateWorkoutComponent implements OnInit {
  workoutForm!: FormGroup;
  isLoading = false;
  globalError = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.setDefaultDateTime();
  }

  private initializeForm(): void {
    this.workoutForm = this.fb.group({
      exerciseType: ['', [Validators.required]],
      durationMinutes: ['', [Validators.required, Validators.min(1), Validators.max(1440)]],
      calories: ['', [Validators.min(0), Validators.max(5000)]],
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
    // if (this.workoutForm.valid) {
    //   this.isLoading = true;
    //   this.globalError = '';
    //
    //   const workoutData: WorkoutRequest = {
    //     exerciseType: this.workoutForm.value.exerciseType,
    //     durationMinutes: parseInt(this.workoutForm.value.durationMinutes),
    //     calories: this.workoutForm.value.calories ? parseInt(this.workoutForm.value.calories) : undefined,
    //     intensity: parseInt(this.workoutForm.value.intensity),
    //     fatigue: parseInt(this.workoutForm.value.fatigue),
    //     performedAt: new Date(this.workoutForm.value.performedAt).toISOString(),
    //     notes: this.workoutForm.value.notes || undefined
    //   };
    // } else {
    //   this.markFormGroupTouched();
    // }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.workoutForm.controls).forEach(key => {
      const control = this.workoutForm.get(key);
      control?.markAsTouched();
    });
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
  get exerciseType() { return this.workoutForm.get('exerciseType'); }
  get durationMinutes() { return this.workoutForm.get('durationMinutes'); }
  get calories() { return this.workoutForm.get('calories'); }
  get performedAt() { return this.workoutForm.get('performedAt'); }
  get notes() { return this.workoutForm.get('notes'); }

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
}
