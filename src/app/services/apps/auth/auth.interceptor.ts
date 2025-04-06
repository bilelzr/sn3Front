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
    if (request.url.match(/\/api\/v1\/auth\/.*/)) {
      return next.handle(request);
    }
    return this.authService.getToken().pipe(
      switchMap((token) => {
        if (token) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
        }
        return next.handle(request).pipe(
          catchError((error) => {
            if (error.status === 401 || error.status === 403) {
              // Handle unauthorized or forbidden errors here
              // For example, trigger sign-in process
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
    // Trigger your sign-in process here
    // For example, navigate to the sign-in page
    // or show a sign-in modal/dialog
    // You might want to store the original request and retry it after successful sign-in

    // For demonstration, let's just log a message and return an observable that ends the chain
    console.error('Unauthenticated request. Redirecting to sign-in page.');
    return throwError('Unauthenticated request. Redirecting to sign-in page.');
  }
}
