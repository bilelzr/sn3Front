import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Application} from "../../models/application";

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {

  private backendUrl = 'http://localhost:8081/api/v1/app';


  constructor(private http: HttpClient) {
  }

  getApplicationByName(nameApp: string): Observable<Application> {
    return this.http.get<Application>(`${this.backendUrl}/byname/${nameApp}`);
  }

  findAllApp(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.backendUrl}/all`);
  }


  addApplication(newApp: Application): Observable<Application> {
    return this.http.post<Application>(`${this.backendUrl}/add`, newApp);
  }

  deleteApplication(uuid: string): Observable<any> {
    console.log("delete method")
    return this.http.delete<any>(`${this.backendUrl}/delete/` + uuid);
  }
}
