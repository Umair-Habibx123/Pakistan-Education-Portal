import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  private apiUrl = environment.apiUrl; 

  constructor(private http: HttpClient) { }

  saveUserPersonalInfo(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}UserInformation/saveUserPeronalInfo`, data);
  }

  saveUserEducationalInfo(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}UserEducation/saveUserEducation`, data);
  }
}