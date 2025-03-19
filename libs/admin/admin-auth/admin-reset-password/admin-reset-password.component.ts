import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-reset-password',
  templateUrl: './admin-reset-password.component.html',
  styleUrls: ['./admin-reset-password.component.scss']
})
export class AdminResetPasswordComponent {
  showPassword: boolean = false; // Tracks password visibility

  // Toggles password visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }


}
