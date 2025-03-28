import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../../models/user";

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private backendUrl = 'http://localhost:8081/api/v1/user';


  constructor(private http: HttpClient) {
  }

  getUserByEmail(email: string) : Observable<User> {
    return this.http.get<User>(`${this.backendUrl}/findByEmail/${email}`);
  }

  findAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.backendUrl}/all`);
  }

  createUser(newUser: User): Observable<User> {
    return this.http.post<User>(`${this.backendUrl}/add`, newUser);
  }

  deleteUser(uuid: string): Observable<any> {
    console.log("delete method")
    return this.http.delete<any>(`${this.backendUrl}/delete/` + uuid);
  }

  lockUserAccount(email: string): Observable<any> {
    return this.http.put<any>(`${this.backendUrl}/lockAccount/` + email, null);
  }

  unLockUserAccount(email: string): Observable<any> {
    return this.http.put<any>(`${this.backendUrl}/unLockAccount/` + email, null);
  }
}
