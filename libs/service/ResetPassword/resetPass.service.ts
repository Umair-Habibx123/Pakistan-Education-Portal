import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    sendOTP(email: string): Observable<any> {
        return this.http.post(`${this.apiUrl}auth-api/saveOTP`, { email });
    }

    verifyOTP(otp: string): Observable<any> {
        const params = new HttpParams().set('otp', otp);
        return this.http.get(`${this.apiUrl}auth-api/getOTP`, { params });
    }
    resetPassword(email: string, password: string): Observable<any> {
        return this.http.post(`${this.apiUrl}user-api/forgetPassword`, { email, password });
    }
}

