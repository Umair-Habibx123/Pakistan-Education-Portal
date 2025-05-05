import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserSessionService } from 'libs/service/userSession/userSession.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private router: Router,
        private userSessionService: UserSessionService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const currentUserString = localStorage.getItem('currentUser');
        const currentUser = currentUserString ? JSON.parse(currentUserString) : null;

        if (currentUser && currentUser.token) {
            request = request.clone({
                setHeaders: {
                    'Content-Type': 'application/json',
                    'Authorization': `JWT ${currentUser.token}`
                }
            });
        }

        return next.handle(request).pipe(
            tap({
                error: (err: any) => {
                    if (err instanceof HttpErrorResponse) {
                        if (err.status === 401) {
                            // this.router.navigate(['/login']);

                            // Clear user session
                            this.userSessionService.clearSession();
                        }
                    }
                }
            })
        );
    }
}