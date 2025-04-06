import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Group} from "../../models/group";

@Injectable({
  providedIn: 'root',
})
export class GroupService {

  private backendUrl = 'http://localhost:8081/api/v1/group';


  constructor(private http: HttpClient) {
  }


  findAllGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.backendUrl}/all`);
  }


  addGroup(newGroup: Group): Observable<Group> {
    return this.http.post<Group>(`${this.backendUrl}/add`, newGroup);
  }

  deleteGroup(groupName: string): Observable<any> {
    console.log("delete method")
    return this.http.delete<any>(`${this.backendUrl}/delete/` + groupName);
  }
}
