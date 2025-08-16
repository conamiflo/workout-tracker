import { Routes } from '@angular/router';
import {LoginComponent} from './features/auth/login/login.component';
import {RegisterComponent} from './features/auth/register/register.component';
import {CreateWorkoutComponent} from './features/workouts/create-workout/create-workout.component';
import {AuthGuard} from './core/guards/auth.guard';
import {GuestGuard} from './core/guards/guest.guard';
import {WorkoutListComponent} from './features/workouts/workout-list/workout-list.component';
import {ProgressTrackingComponent} from './features/workouts/progress-tracking/progress-tracking.component';
import {ProfileComponent} from './features/users/profile/profile.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent , canActivate: [GuestGuard]},
  { path: 'register', component: RegisterComponent , canActivate: [GuestGuard]},
  {
    path: 'new-workout',
    component: CreateWorkoutComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'workouts',
    component: WorkoutListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'progress',
    component: ProgressTrackingComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/login' }
];
