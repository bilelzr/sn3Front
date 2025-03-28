import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { catchError, Observable, switchMap, throwError } from "rxjs";
import { Router } from "@angular/router";
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('Interceptor executed');

    // Check if the request method is OPTIONS (preflight request)
    if (request.method === 'OPTIONS') {
      // Modify the headers for the OPTIONS request here
      request = request.clone({
        setHeaders: {
          'Authorization': `Bearer ${this.authService.getToken()}`, // Add Authorization or any other header
          'Custom-Header': 'YourCustomHeaderValue',  // Add any custom headers for OPTIONS requests
        }
      });
    }

    return this.authService.getToken().pipe(
      switchMap((token) => {
        if (token && request.method !== 'OPTIONS') {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
        }
        return next.handle(request).pipe(
          catchError((error) => {
            if (error.status === 401 || error.status === 403) {
              return this.handleAuthError(request, next);
            }
            return throwError(error);
          })
        );
      })
    );
  }

  private handleAuthError(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<any> {
    console.error('Unauthenticated request. Redirecting to sign-in page.');
    this.authService.logout();
    this.router.navigate(['/']);
    return throwError('Unauthenticated request. Redirecting to sign-in page.');
  }
}
