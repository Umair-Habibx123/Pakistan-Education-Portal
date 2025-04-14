import { Component } from '@angular/core';
import { AuthService } from 'libs/service/ResetPassword/resetPass.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-forgot',
  templateUrl: './admin-forgot.component.html',
  styleUrls: ['./admin-forgot.component.scss']
})
export class AdminForgotComponent {
  forgotForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get email() {
    return this.forgotForm.get('email');
  }

  onSubmit() {
    if (this.forgotForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.sendOTP(this.forgotForm.value.email).subscribe({
      next: (response) => {
        this.isLoading = false;
        // Navigate to enter code page with email as state
        this.router.navigate(['/adminAuth/adminEnterCode'], {
          state: { email: this.forgotForm.value.email }
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to send OTP. Please try again.';
      }
    });
  }
}