import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, Observable, of, tap} from 'rxjs';
import {environment} from '../../environments/environment';
import {TokenStorageService} from './token-storage.service';
import {LoginRequest} from '../models/login-request.model';
import {LoginResponse} from '../models/login-response.model';
import {TokenRefreshRequest} from '../models/token-refresh-request.model';
import {TokenRefreshResponse} from '../models/token-refresh-response.model';
import {UserRegistrationRequest} from '../models/user-registration-request.model';
import {UserResponse} from '../models/user-response.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private tokenService: TokenStorageService) {}

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, data).pipe(
      tap((res) => {
        this.tokenService.setAuthData(res);
      })
    );
  }

  refreshToken(data: TokenRefreshRequest): Observable<TokenRefreshResponse> {
    return this.http.post<TokenRefreshResponse>(`${this.API_URL}/refresh`, data).pipe(
      tap((res) => {
        this.tokenService.setAccessToken(res.accessToken);
        this.tokenService.setRefreshToken(res.refreshToken);
      })
    );
  }

  register(data: UserRegistrationRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.API_URL}/register`, data);
  }

  logout(): Observable<any> {
    const refreshToken = this.tokenService.getRefreshToken();
    return this.http.post(`${this.API_URL}/logout`, { refreshToken }).pipe(
      tap(() => {
        this.tokenService.clear();
      }),
      catchError((error) => {
        this.tokenService.clear();
        return of(null);
      }))
  }

  isAuthenticated(): boolean {
    return !!this.tokenService.getAccessToken();
  }
}
