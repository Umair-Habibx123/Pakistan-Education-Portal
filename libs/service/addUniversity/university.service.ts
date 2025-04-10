// university.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class UniversityService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUniversity(uniID: number): Observable<any> {
    return this.http.get<any[]>(
      `${this.apiUrl}school-api/University/getUniversity?uniID=${uniID}`
    );
  }

  getDistinctUniversities(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}school-api/University/getDistinctUniversities`
    );
  }

  saveUniversity(universityData: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}school-api/University/saveUniversity`,
      universityData
    );
  }

  getCities(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}school-api/University/getCity`);
  }
}
