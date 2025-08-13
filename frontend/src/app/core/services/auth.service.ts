import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {environment} from '../../environments/environment';
import {TokenStorageService} from './token-storage.service';
import {LoginRequest} from '../models/login-request.model';
import {LoginResponse} from '../models/login-response.model';
import {TokenRefreshRequest} from '../models/token-refresh-request.model';
import {TokenRefreshResponse} from '../models/token-refresh-response.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private tokenService: TokenStorageService) {}

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, data).pipe(
      tap((res) => {
        this.tokenService.setAccessToken(res.accessToken);
        this.tokenService.setRefreshToken(res.refreshToken);
        this.tokenService.setUsername(res.username);
      })
    );
  }

  refreshToken(data: TokenRefreshRequest): Observable<TokenRefreshResponse> {
    return this.http.post<TokenRefreshResponse>(`${this.API_URL}/refresh`, data).pipe(
      tap((res) => {
        this.tokenService.setAccessToken(res.accessToken);
      })
    );
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, data);
  }

  logout(): void {
    this.tokenService.clear();
  }

  isAuthenticated(): boolean {
    return !!this.tokenService.getAccessToken();
  }
}
