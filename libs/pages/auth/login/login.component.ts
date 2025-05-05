import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserSessionService } from 'libs/service/userSession/userSession.service';
import { AuthService } from 'libs/service/userSignUp/userAuth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  showPassword: boolean = false;
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showSuccess = false;
  showError = false;

  constructor(
    private userService: AuthService,
    private sessionService: UserSessionService,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.pattern('(?=.*[A-Z]).*')
      ]],
    }, {});
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.showError = false;
    this.showSuccess = false;

    const authData = {
      loginname: this.loginForm.value.email,
      hashpassword: this.loginForm.value.password,
    };

    this.userService.login(authData)
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          console.log(response)
          if (response.token) {
            this.sessionService.saveUserSession(response);
            this.successMessage = 'Login successful! Redirecting...';
            this.showSuccess = true;
            if (response.roleId === 1 || response.roleId === 2) {
              setTimeout(() => {
                this.router.navigate(['/admin-dashboard']);
              }, 1500);
            }
            else {
              setTimeout(() => {
                this.router.navigate(['/']);
              }, 1500);
            }
          } else {
            this.errorMessage = response.message || 'Login failed. Please try again.';
            this.showError = true;
          }
        },
        error: (error: any) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || error.message || 'Login failed. Please try again.';
          this.showError = true;
        }
      });
  }
}