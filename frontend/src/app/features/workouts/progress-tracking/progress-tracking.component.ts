import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkoutService } from '../../../core/services/workout.service';
import {TokenStorageService} from '../../../core/services/token-storage.service';

@Component({
  selector: 'app-progress-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './progress-tracking.component.html',
  styleUrls: ['./progress-tracking.component.css']
})
export class ProgressTrackingComponent implements OnInit {
  selectedMonth = '';
  monthlySummary: MonthlySummary | null = null;
  isLoading = false;
  error = '';
  currentUsername = '';

  constructor(
    private workoutService: WorkoutService,
    private tokenService: TokenStorageService,
  ) {}

  ngOnInit(): void {
    this.currentUsername = this.tokenService.getUsername() || '';
    const now = new Date();
    this.selectedMonth = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    this.loadProgress();
  }

  onMonthChange(): void {
    if (this.selectedMonth) {
      this.loadProgress();
    }
  }

  private loadProgress(): void {
    if (!this.selectedMonth || !this.currentUsername) return;

    const [year, month] = this.selectedMonth.split('-').map(Number);
    this.isLoading = true;
    this.error = '';

    this.workoutService.getMonthlyProgress(this.currentUsername, year, month).subscribe({
      next: (summary: MonthlySummary) => {
        this.isLoading = false;
        this.monthlySummary = summary;
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 404) {
          this.error = 'No workout data found for this month.';
        } else {
          this.error = error.error?.message || 'Unable to load progress data. Please try again.';
        }
      }
    });
  }

  getMonthDisplayName(): string {
    if (!this.selectedMonth) return '';
    const [year, month] = this.selectedMonth.split('-').map(Number);
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  }

  formatDuration(minutes: number): string {
    if (minutes === 0) return '0min';

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
    }
    return `${mins}min`;
  }

  formatAverage(value: number): string {
    return value > 0 ? value.toFixed(1) : '0.0';
  }

  getColor(intensity: number): string {
    if (intensity <= 3) return '#10b981';
    if (intensity <= 6) return '#f59e0b';
    return '#ef4444';
  }

}
