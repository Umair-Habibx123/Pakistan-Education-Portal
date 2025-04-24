import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})


export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  signup(registrationData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}auth-api/saveUser`, registrationData);
    // return this.http.post(`${this.apiUrl}user-api/saveMobileUser`, registrationData);
  }

  updateUser(userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}`, userData);
  }

  login(loginData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}auth-api/auth`, loginData);
  }

  getRoles(): Observable<any> {
    return this.http.get(`${this.apiUrl}auth-api/auth`);
  }
}