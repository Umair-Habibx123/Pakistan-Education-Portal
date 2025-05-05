import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResetPassService } from 'libs/service/ResetPassword/resetPass.service';
import { Router } from '@angular/router';
import { UserSessionService } from 'libs/service/userSession/userSession.service';

@Component({
  selector: 'app-admin-reset-password',
  templateUrl: './admin-reset-password.component.html',
  styleUrls: ['./admin-reset-password.component.scss']
})
export class AdminResetPasswordComponent {
  showPassword: boolean = false;
  resetForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  email: string = '';

  constructor(
    private fb: FormBuilder,
    private resetPassword: ResetPassService,
    private router: Router,
    private sessionService: UserSessionService
  ) {
    // Get email from navigation state
    const navigation = this.router.getCurrentNavigation();
    this.email = navigation?.extras?.state?.['email'] || '';
    
    // If no email, redirect back
    if (!this.email) {
      this.router.navigate(['/auth/login']);
    }

    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.resetForm.invalid) {
      if (this.resetForm.hasError('mismatch')) {
        this.errorMessage = 'Passwords do not match';
      } else {
        this.errorMessage = 'Please enter valid passwords (minimum 8 characters)';
      }
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { password } = this.resetForm.value;

    this.resetPassword.resetPassword(this.email, password).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        // Clear user session if logged in
        this.sessionService.clearSession();
        
        // Redirect to login with success message
        this.router.navigate(['/adminAuth/adminLogin'], {
          state: { passwordReset: true }
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to reset password. Please try again.';
      }
    });
  }
}