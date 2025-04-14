import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from 'libs/service/userSignUp/userSignup.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private userService: AuthService,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('(?=.*[A-Z]).*')
      ]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const registrationData = {
      email: this.registerForm.value.email,
      mobile: this.registerForm.value.mobile,
      password: this.registerForm.value.password,
      roleID: 2
    };

    this.userService.signup(registrationData)
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          if (response.includes('Success')) {
            this.router.navigate(['/']);
          } else {
            this.errorMessage = response;
          }
        },
        error: (error :any) => {
          this.isLoading = false;
          this.errorMessage = error.error || 'Registration failed. Please try again.';
        }
      });
  }
}