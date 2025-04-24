// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable, of } from 'rxjs';
// import { map, catchError } from 'rxjs/operators';
// import { environment } from 'src/environments/environments';

// @Injectable({
//   providedIn: 'root'
// })
// export class UserSessionService {
//   private readonly TOKEN_KEY = 'authToken';
//   private readonly USER_ID_KEY = 'userId';
//   private userDetails: any = null;
//   apiURL: string = '';


//   constructor(private http: HttpClient) {
//     this.apiURL = environment.apiUrl;
//   }

//   saveUserSession(userData: any): void {
//     if (userData?.token) {
//       localStorage.setItem(this.TOKEN_KEY, userData.token);
//     }
//     if (userData?.userLoginId) {
//       localStorage.setItem(this.USER_ID_KEY, userData.userLoginId.toString());
//     }

//     this.userDetails = null;
//   }

//   getUserId(): number | null {
//     const userId = localStorage.getItem(this.USER_ID_KEY);
//     return userId ? parseInt(userId) : null;
//   }

//   getToken(): string | null {
//     return localStorage.getItem(this.TOKEN_KEY);
//   }

//   isLoggedIn(): boolean {
//     return this.getToken() !== null && this.getUserId() !== null;
//   }

//   clearSession(): void {
//     localStorage.removeItem(this.TOKEN_KEY);
//     localStorage.removeItem(this.USER_ID_KEY);
//     this.userDetails = null;
//   }

//   private getHeaders(): HttpHeaders {
//     const token = this.getToken();
//     if (!token) {
//       console.error('No token available');
//     }
//     console.log(token);
//     return new HttpHeaders({
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     });
//   }

//   getUserDetails(): Observable<any> {
//     const userId = this.getUserId();
//     if (!userId) {
//       return of(null);
//     }

//     if (this.userDetails) {
//       return of(this.userDetails);
//     }

//     const headers = this.getHeaders();


//     return this.http.get<any>(`${this.apiURL}user-api/User/getUserDetail?userID=${userId}` , {headers}).pipe(
//       map(response => {
//         this.userDetails = response;
//         return response;
//       }),
//       catchError(error => {
//         console.error('Failed to fetch user details', error);
//         return of(null);
//       })
//     );
//   }


//   getRoleJson(): Observable<any | null> {
//     return this.getUserDetails().pipe(
//       map(details => {
//         if (!details?.roleJson) return null;
//         console.log(details?.roleJson)
//         try {
//           return JSON.parse(details.roleJson);
//         } catch (e) {
//           console.error('Error parsing roleJson', e);
//           return null;
//         }
//       })
//     );
//   }

//   hasRole(roleId: number): Observable<boolean> {
//     return this.getUserDetails().pipe(
//       map(details => {
//         if (!details || !details.roleJson) return false;
//         try {
//           const roles = JSON.parse(details.roleJson);
//           return roles.some((role: any) => role.roleId === roleId);
//         } catch (e) {
//           console.error('Error parsing roleJson', e);
//           return false;
//         }
//       })
//     );
//   }
// }


import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserSessionService {
  private readonly USER_KEY = 'currentUser';
  private readonly TOKEN_KEY = 'authToken';

  constructor() { }


  saveUserSession(userData: any): void {
    if (userData?.token) {
      localStorage.setItem(this.TOKEN_KEY, userData.token);
    }


    const userToStore = {
      userLoginId: userData.userLoginId,
      roleId: userData.roleId,
      roleJson: userData.roleJson,
      fullName: userData.fullName,
      loginName: userData.loginName,
      roleTitle: userData.roleTitle,
    };

    localStorage.setItem(this.USER_KEY, JSON.stringify(userToStore));
  }

  getUser(): any {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }


  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }


  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }


  getRoleId(): number | null {
    const user = this.getUser();
    return user?.roleId || null;
  }


  getRoleTitle(): string | null {
    const user = this.getUser();
    return user?.roleTitle || null;
  }


  clearSession(): void {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
  }

  hasRole(roleId: number): boolean {
    const user = this.getUser();
    if (!user || !user.roleJson) return false;

    try {
      const roles = JSON.parse(user.roleJson);
      return roles.some((role: any) => role.roleId === roleId);
    } catch (e) {
      console.error('Error parsing roleJson', e);
      return false;
    }
  }
}