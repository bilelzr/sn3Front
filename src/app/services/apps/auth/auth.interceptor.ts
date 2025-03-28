import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { catchError, Observable, switchMap, throwError } from "rxjs";
import { Router } from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.includes('/signin') || request.url.includes('/login')) {
      return next.handle(request); // Skip the interceptor for sign-in/login requests
    }

    // Get the token from AuthService
    return this.authService.getToken().pipe(
      switchMap((token) => {
        if (token) {
          // Clone the request and add the Authorization header
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("Authorization header added", request);  // Check if the header is added here
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

  private handleAuthError(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    // If the token is expired or invalid, redirect to the sign-in page
    console.error('Unauthenticated request. Redirecting to sign-in page.');
    this.authService.logout(); // Log the user out
    this.router.navigate(['/signin']); // Navigate to sign-in page
    return throwError('Unauthenticated request. Redirecting to sign-in page.');
  }
}
