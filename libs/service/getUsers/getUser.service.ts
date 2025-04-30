import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { UserSessionService } from 'libs/service/userSession/userSession.service';

@Injectable({
    providedIn: 'root',
})
export class GetUserService {
    private apiUrlauth = environment.apiUrlauth;

    constructor(
        private http: HttpClient,
        private userSessionService: UserSessionService
    ) { }

    private getHeaders(): HttpHeaders {
        const token = this.userSessionService.getToken();
        if (!token) {
            console.error('No token available');
        }
        console.log(token);
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });
    }


    getUsers(): Observable<any> {
        const headers = this.getHeaders();
        const url = `${this.apiUrlauth}user-api/User/getAllUser`;
        console.log('Making request to:', url);
        console.log('With headers:', headers);
        return this.http.get<any[]>(url, { headers });
    }
}