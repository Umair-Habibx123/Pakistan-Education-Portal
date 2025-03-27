import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class addprogramService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  addprogram(programData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}University/saveCampusPrograms`, programData);
  }
  
}