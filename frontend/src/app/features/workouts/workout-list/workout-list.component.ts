import {Component, OnInit, ViewChild, AfterViewInit, ViewEncapsulation} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Workout } from '../../../core/models/workout.model';
import { WorkoutService} from '../../../core/services/workout.service';
import { TokenStorageService } from '../../../core/services/token-storage.service';
import {Page} from '../../../core/models/page.model';

@Component({
  selector: 'app-workout-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './workout-list.component.html',
  styleUrls: ['./workout-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class WorkoutListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort, {static: true}) sort: MatSort | undefined;

  constructor(
    private workoutService: WorkoutService,
    private tokenService: TokenStorageService
  ) {}

  dataSource = new MatTableDataSource<Workout>();

  currentPage: number = 0;
  pageSize: number = 5;
  totalItems!: number;
  isLoading = false;
  currentUsername: string = '';

  displayedColumns: string[] = [
    'exerciseType',
    'durationMinutes',
    'calories',
    'intensity',
    'fatigue',
    'performedAt',
    'notes',
    'actions'
  ];

  ngOnInit(): void {
    this.currentUsername = this.tokenService.getUsername() || '';
    this.fetchWorkouts(this.currentPage, this.pageSize);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort!;
    this.fetchWorkouts(this.currentPage, this.pageSize);
  }

  private fetchWorkouts(currentPage: number = 0, pageSize: number = 10): void {
    this.isLoading = true;
    this.workoutService.getUserWorkouts(this.currentUsername, currentPage, pageSize)
      .subscribe({
        next: (response: Page<Workout>) => {
          this.dataSource.data = response.content;
          this.totalItems = response.totalElements;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading workouts:', error);
          this.dataSource.data = [];
          this.totalItems = 0;
          this.isLoading = false;
        }
      });
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchWorkouts(this.currentPage, this.pageSize);
  }

  deleteWorkout(workoutId: string): void {
    const confirmDelete = confirm('Are you sure you want to delete this workout?');
    if (confirmDelete) {
      this.isLoading = true;

      this.workoutService.deleteWorkout(workoutId, this.currentUsername)
        .subscribe({
          next: () => {
            console.log('Workout deleted successfully');
            this.fetchWorkouts(this.currentPage, this.pageSize);
          },
          error: (error) => {
            console.error('Error deleting workout:', error);
            this.isLoading = false;
          }
        });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Optional: Refresh method
  refresh(): void {
    this.currentPage = 0;
    this.fetchWorkouts(this.currentPage, this.pageSize);
  }
}
