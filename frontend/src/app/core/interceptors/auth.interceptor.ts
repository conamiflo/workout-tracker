import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { TokenStorageService } from '../services/token-storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private isRefreshing = false;

    private excludedUrls = [
        '/api/auth/login',
        '/api/auth/refresh',
        '/api/auth/register'
    ];

    constructor(
        private authService: AuthService,
        private tokenService: TokenStorageService
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authReq = req;

        if (!this.excludedUrls.some(url => req.url.includes(url))) {
            const token = this.tokenService.getAccessToken();
            if (token) {
                authReq = req.clone({
                    setHeaders: { Authorization: `Bearer ${token}` }
                });
            }
        }

        return next.handle(authReq).pipe(
            catchError((error: HttpErrorResponse) => {
                if ((error.status === 401 || error.status === 403) &&
                    !this.isRefreshing &&
                    !req.url.includes('/api/auth/refresh')) {

                    this.isRefreshing = true;

                    const refreshToken = this.tokenService.getRefreshToken();
                    if (!refreshToken) {
                        this.isRefreshing = false;
                        return throwError(() => error);
                    }

                    return this.authService.refreshToken({ refreshToken }).pipe(
                        switchMap((res) => {
                            this.isRefreshing = false;

                            this.tokenService.setAccessToken(res.accessToken);
                            this.tokenService.setRefreshToken(res.refreshToken);

                            const newReq = req.clone({
                                setHeaders: { Authorization: `Bearer ${res.accessToken}` }
                            });

                            return next.handle(newReq);
                        }),
                        catchError(refreshErr => {
                            this.isRefreshing = false;
                            this.tokenService.clear();
                            return throwError(() => refreshErr);
                        })
                    );
                }

                return throwError(() => error);
            })
        );
    }
}
