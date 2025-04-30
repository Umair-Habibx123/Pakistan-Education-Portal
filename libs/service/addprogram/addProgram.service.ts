import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class addprogramService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  addprogram(programData: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}Campus/saveCampusPrograms`,
      programData
    );
  }

  getPrograms(educationTypeID: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Program/getAllPrograms?educationTypeID=${educationTypeID}`
    );
  }

  getProgramsForHome(educationTypeID: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Program/getPrograms?educationTypeID=${educationTypeID}`
    );
  }

  getTeachingMode(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Program/getTeachingMode`
    );
  }

  getCampusProgram(campusID: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Program/getCampusProgram?campusID=${campusID}`
    );
  }

  getEducationType(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Program/getEducationType`
    );
  }
}
