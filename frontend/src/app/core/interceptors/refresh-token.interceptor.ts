import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, switchMap, catchError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import {TokenStorageService} from '../services/token-storage.service';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(private authService: AuthService, private tokenService: TokenStorageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401 && !this.isRefreshing) {
          this.isRefreshing = true;
          const refreshToken = this.tokenService.getRefreshToken();

          if (refreshToken) {
            return this.authService.refreshToken({ refreshToken }).pipe(
              switchMap(() => {
                this.isRefreshing = false;
                const newAccessToken = this.tokenService.getAccessToken();
                return next.handle(
                  req.clone({
                    setHeaders: { Authorization: `Bearer ${newAccessToken}` }
                  })
                );
              }),
              catchError((err) => {
                this.isRefreshing = false;
                this.tokenService.clear();
                return throwError(() => err);
              })
            );
          }
        }
        return throwError(() => error);
      })
    );
  }
}
