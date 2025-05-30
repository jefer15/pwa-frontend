import { Injectable } from "@angular/core";
import { BehaviorSubject, of } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenSubject = new BehaviorSubject<string | null>(this.getToken());
  private apiUrl = `${environment.uri}/auth`;

  constructor(private _http: HttpClient, private router: Router) { }

  login(data: any) {
    return this._http.post(this.apiUrl, data).pipe(map((response: any) => {
      if(response){
        this.setToken(response.token);
      }
      return response;
    }));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', JSON.stringify(token));
    this.tokenSubject.next(token);
  }

  getUser(): string | null {
    return localStorage.getItem('user');
  }
  logout(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.tokenSubject.next(null);
    this.router.navigate(["/login"]);
  }

  getTokenSubject(): BehaviorSubject<string | null> {
    return this.tokenSubject;
  }
}

