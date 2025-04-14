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
    return this.http.post(`${this.apiUrl}school-api/User/saveMobileUser`, registrationData);
  }
}