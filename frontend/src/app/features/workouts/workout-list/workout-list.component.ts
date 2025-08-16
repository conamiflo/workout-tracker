import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Workout } from '../../../core/models/workout.model';
import { WorkoutService } from '../../../core/services/workout.service';
import { TokenStorageService } from '../../../core/services/token-storage.service';
import { Page } from '../../../core/models/page.model';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData
} from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import {SuccessPopupComponent} from '../../../shared/components/success-popup/success-popup.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-workout-list',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    SuccessPopupComponent,
  ],
  templateUrl: './workout-list.component.html',
  styleUrls: ['./workout-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class WorkoutListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private workoutService: WorkoutService,
    private tokenService: TokenStorageService,
    private dialog: MatDialog,
    private router: Router,
  ) {}


  currentPage: number = 0;
  pageSize: number = 6;
  totalItems!: number;
  isLoading = false;
  currentUsername: string = '';
  showSuccessPopup = false;
  workouts: Workout[] = [];

  ngOnInit(): void {
    this.currentUsername = this.tokenService.getUsername() || '';
    this.fetchWorkouts(this.currentPage, this.pageSize);
  }

  private fetchWorkouts(currentPage: number = 0, pageSize: number = 6): void {
    this.isLoading = true;
    this.workoutService.getUserWorkouts(this.currentUsername, currentPage, pageSize)
      .subscribe({
        next: (response: Page<Workout>) => {
          this.workouts = this.workouts = [...response.content];
          this.totalItems = response.totalElements;
          this.isLoading = false;
          console.log('Fetched workouts:', response);
        },
        error: (error) => {
          console.error('Error loading workouts:', error);
          this.workouts = [];
          this.totalItems = 0;
          this.isLoading = false;
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchWorkouts(this.currentPage, this.pageSize);
  }

  deleteWorkout(workoutId: string): void {
    const dialogData: ConfirmationDialogData = {
      title: 'Delete Workout',
      message: 'Are you sure you want to delete this workout? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: dialogData,
      disableClose: true,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.performDelete(workoutId);
      }
    });
  }

  private performDelete(workoutId: string): void {
    this.isLoading = true;

    this.workoutService.deleteWorkout(workoutId, this.currentUsername)
      .subscribe({
        next: () => {
          const maxPage = Math.max(0, Math.ceil((this.totalItems - 1) / this.pageSize) - 1);
          const targetPage = Math.min(this.currentPage, maxPage);
          this.fetchWorkouts(targetPage, this.pageSize);
          this.showSuccessPopup = true;
        },
        error: (error) => {
          console.error('Error deleting workout:', error);
          this.isLoading = false;
        }
      });
  }

  onPopupClose(): void {
    this.showSuccessPopup = false;
    this.router.navigate(['/workouts']);
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
}
