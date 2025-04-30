import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrlauth = environment.apiUrlauth;

    constructor(private http: HttpClient) { }

    sendOTP(email: string): Observable<any> {
        return this.http.post(`${this.apiUrlauth}auth-api/saveOTP`, { email });
    }

    verifyOTP(otp: string): Observable<any> {
        const params = new HttpParams().set('otp', otp);
        return this.http.get(`${this.apiUrlauth}auth-api/getOTP`, { params });
    }
    resetPassword(email: string, password: string): Observable<any> {
        return this.http.post(`${this.apiUrlauth}user-api/forgetPassword`, { email, password });
    }
}

