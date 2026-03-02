import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  // 1. Request Interceptor: Add Token
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  // 2. Response Interceptor: Handle Errors
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      const isAiRequest = req.url.includes('ai');

      if (error.status === 401 || error.status === 403) {
        if (isAiRequest) {
          console.error("AI Service unavailable or rejected, session preserved.");
        } else {
          console.warn("Session expired. Redirecting to login...");
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          router.navigate(['/login']);
        }
      }
      return throwError(() => error);
    })
  );
};
