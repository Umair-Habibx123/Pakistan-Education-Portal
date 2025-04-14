import { Component } from '@angular/core';
import { AuthService } from 'libs/service/ResetPassword/resetPass.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-admin-enter-code',
  templateUrl: './admin-enter-code.component.html',
  styleUrls: ['./admin-enter-code.component.scss']
})
export class AdminEnterCodeComponent {
  isLoading = false;
  errorMessage = '';
  email: string = '';
  otp: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private location: Location
  ) {
    // Get email from navigation state
    const navigation = this.router.getCurrentNavigation();
    this.email = navigation?.extras?.state?.['email'] || '';
    
    // If no email, redirect back
    if (!this.email) {
      this.location.back();
    }
  }

  moveToNext(event: any, nextInputId: string) {
    const input = event.target;
    this.updateOTP();

    if (input.value.length === 1) {
      if (nextInputId) {
        const nextInput = document.getElementById(nextInputId) as HTMLInputElement;
        if (nextInput) {
          nextInput.focus();
        }
      } else {
        
        if (this.otp.length === 4) {
          this.verifyOTP();
        }
      }
    }
  }

  onKeyDown(event: KeyboardEvent, currentInputId: string) {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace' && input.value.length === 0) {
      const previousInputId = this.getPreviousInputId(currentInputId);
      if (previousInputId) {
        const previousInput = document.getElementById(previousInputId) as HTMLInputElement;
        if (previousInput) {
          previousInput.focus();
        }
      }
    }
  }

  getPreviousInputId(currentInputId: string): string | null {
    const inputNumber = parseInt(currentInputId.replace('input', ''), 10);
    if (inputNumber > 1) {
      return `input${inputNumber - 1}`;
    }
    return null;
  }

  updateOTP() {
    this.otp = '';
    for (let i = 1; i <= 4; i++) {
      const input = document.getElementById(`input${i}`) as HTMLInputElement;
      if (input && input.value) {
        this.otp += input.value;
      }
    }
  }

  verifyOTP() {
    if (this.otp.length !== 4) {
      this.errorMessage = 'Please enter a 4-digit OTP';
      return;
    }
  
    this.isLoading = true;
    this.errorMessage = '';
  
    this.authService.verifyOTP(this.otp).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response && response.length > 0) {
          this.router.navigate(['/adminAuth/adminResetPassword'], {
            state: { email: this.email }
          });
        } else {
          this.errorMessage = 'Invalid OTP. Please try again.';
          this.clearInputs();
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Invalid OTP. Please try again.';
        this.clearInputs();
      }
    });
  }
  
  clearInputs() {
    // Clear all inputs
    for (let i = 1; i <= 4; i++) {
      const input = document.getElementById(`input${i}`) as HTMLInputElement;
      if (input) {
        input.value = '';
      }
    }
    // Focus on first input
    const firstInput = document.getElementById('input1') as HTMLInputElement;
    if (firstInput) {
      firstInput.focus();
    }
    this.otp = '';
  }

  resendOTP() {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.sendOTP(this.email).subscribe({
      next: (response) => {
        this.isLoading = false;
        // Clear all inputs
        for (let i = 1; i <= 4; i++) {
          const input = document.getElementById(`input${i}`) as HTMLInputElement;
          if (input) {
            input.value = '';
          }
        }
        // Focus on first input
        const firstInput = document.getElementById('input1') as HTMLInputElement;
        if (firstInput) {
          firstInput.focus();
        }
        this.otp = '';
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to resend OTP. Please try again.';
      }
    });
  }
}