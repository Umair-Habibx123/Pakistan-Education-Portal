import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class addprogramService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  addprogram(programData: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}school-api/Campus/saveCampusPrograms`,
      programData
    );
  }

  getPrograms(educationTypeID: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}school-api/Program/getPrograms?educationTypeID=${educationTypeID}`
    );
  }

  getCampusProgram(campusID: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}school-api/Program/getCampusProgram?campusID=${campusID}`
    );
  }

  getEducationType(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}school-api/Program/getEducationType`
    );
  }
}
