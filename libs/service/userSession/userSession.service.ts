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