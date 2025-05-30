import { Injectable } from "@angular/core";
import { BehaviorSubject, of } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.uri}/auth`;

  constructor(private _http: HttpClient, private router: Router) { }

  saveUser(data: any) {
    return this._http.post(`${this.apiUrl}/register`, data).pipe(map((response: any) => {
      return response;
    }));
  }
}
