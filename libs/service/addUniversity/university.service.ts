// university.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { ObserversModule } from '@angular/cdk/observers';

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


  getUniversityNames(): Observable<any> {
    return this.http.get<any[]>(
      `${this.apiUrl}school-api/University/getAllUniversity`
    );
  }

  getUniversityForHero(educationTypeID: number, programID: number | null, cityID: number | null): Observable<any> {
    let url = `${this.apiUrl}school-api/University/getUniversityCampusProgram?educationTypeID=${educationTypeID}`;
    
    if (programID) {
      url += `&programID=${programID}`;
    }
    
    if (cityID) {
      url += `&cityID=${cityID}`;
    }
    
    return this.http.get<any>(url);
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
