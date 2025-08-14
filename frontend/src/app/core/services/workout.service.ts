import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {CreateWorkoutDTO} from '../models/create-workout.model';
import {Observable} from 'rxjs';
import {Workout} from '../models/workout.model';
import {Page} from '../models/page.model';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private readonly API_URL = `${environment.apiUrl}/workouts`;

  constructor(private http: HttpClient) {}

  createWorkout(workoutData: CreateWorkoutDTO): Observable<Workout> {
    return this.http.post<Workout>(this.API_URL, workoutData);
  }

  getUserWorkouts(username: string, page: number = 0, size: number = 5): Observable<Page<Workout>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<Workout>>(`${this.API_URL}/${username}`, { params });
  }

  deleteWorkout(workoutId: string, username: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${workoutId}/user/${username}`);
  }

  getMonthlyProgress(username: string, year: number, month: number): Observable<MonthlySummary> {
    const params = new HttpParams()
      .set('year', year.toString())
      .set('month', month.toString());

    return this.http.get<MonthlySummary>(`${this.API_URL}/${username}/progress`, { params });
  }

}
