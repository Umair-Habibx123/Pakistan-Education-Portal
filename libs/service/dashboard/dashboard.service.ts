import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Get monthly student data for charts
  getMonthlyStudentData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}Dashboard/getTotalStudentMonthly`);
  }

  // Get application status count
  getApplicationStatus(applicationStatusName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}Dashboard/getApplicationStatus?applicationStatusName=${applicationStatusName}`);
  }

  // Get university count
  getUniversityCount(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}Dashboard/getUniversityCount`);
  }

  // Get total program count
  getProgramCount(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}Dashboard/getProgramCount`);
  }

  // Get total student count
  getTotalStudentCount(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}Dashboard/getTotalStudentCount`);
  }

  // Get program count by education type
  getProgramCountByName(educationTypeTitle: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}Dashboard/getProgramCountByName?educationTypeTitle=${educationTypeTitle}`);
  }

}