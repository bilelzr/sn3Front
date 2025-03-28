import {Injectable} from "@angular/core";
import {HttpClient} from '@angular/common/http';
import {Observable,of} from "rxjs";
import {AuthenticationResponse} from "../../models/authenticationResponse";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private signInUrl = 'http://localhost:8081/api/v1/auth/signin'; // Replace this with your actual API endpoint
  private token: string;
  private tokenKey = 'token';


  constructor(private http: HttpClient, private router: Router) {

  }

  signIn(email: string, password: string): Observable<AuthenticationResponse> {
    const singInRequest  = {email: email, password: password};
    return this.http.post<AuthenticationResponse>(this.signInUrl, singInRequest);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token); // Store the token in local storage
  }

  getToken(): Observable<string> {
    const token = localStorage.getItem('token') || ''; // Fallback to empty string
    return of(token);
  }


  logout(): void {
    sessionStorage.removeItem('userRole'); // Remove the token from local storage
    sessionStorage.removeItem('userEmail'); // Remove the token from local storage
    this.router.navigate(['/authentication/login']);
  }

}
