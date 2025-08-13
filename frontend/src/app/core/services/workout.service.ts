import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';
import {CreateWorkoutDTO} from '../models/create-workout.model';
import {Observable} from 'rxjs';
import {Workout} from '../models/workout.model';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private readonly API_URL = `${environment.apiUrl}/workouts`;

  constructor(private http: HttpClient) {}

  createWorkout(workoutData: CreateWorkoutDTO): Observable<Workout> {
    return this.http.post<Workout>(this.API_URL, workoutData);
  }

}
