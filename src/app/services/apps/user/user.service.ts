import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
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
    console.log("UserService::getUserByEmail", email);
    return this.http.get<User>(`${this.backendUrl}/findByEmail/${email}`, {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqb2huLmRvZUBleGFtcGxlLmNvbSIsImlhdCI6MTc0MzE3Nzc0MiwiZXhwIjoxNzQzNDM2OTQyfQ.gnpmNNqtFtNg3QN3OFI1cTFA0jOXkHI9pU3NFdDB-Jw')});
  }
}
