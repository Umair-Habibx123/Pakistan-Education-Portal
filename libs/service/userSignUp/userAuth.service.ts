import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})


export class AuthService {
  private apiUrlauth = environment.apiUrlauth;

  constructor(private http: HttpClient) { }

  signup(registrationData: any): Observable<any> {
    return this.http.post(`${this.apiUrlauth}auth-api/saveUser`, registrationData);
  }

  login(loginData: any): Observable<any> {
    return this.http.post(`${this.apiUrlauth}auth-api/auth`, loginData);
  }

  getRoles(): Observable<any> {
    return this.http.get(`${this.apiUrlauth}auth-api/auth`);
  }
}