import { Component } from '@angular/core';
import { ResetPassService } from 'libs/service/ResetPassword/resetPass.service';
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
    private resetPassService: ResetPassService,
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

    this.resetPassService.sendOTP(this.forgotForm.value.email).subscribe({
      next: (response) => {
        this.isLoading = false;
        // Navigate to enter code page with email as state
        this.router.navigate(['/auth/enterCode'], {
          state: { email: this.forgotForm.value.email }
        });
      },
      error: (error) => {
        this.isLoading = false;
        if (error.error?.message === "Please enter valid email address") {
          this.errorMessage = 'Email not exists... please Create A Account';
        }
        else {
          this.errorMessage = 'Failed to send OTP. Please try again.';
        }
      }
    });
  }
}