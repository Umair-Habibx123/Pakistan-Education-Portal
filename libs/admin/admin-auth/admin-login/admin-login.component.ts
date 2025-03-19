import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent {
  showPassword: boolean = false; // Tracks password visibility

  // Toggles password visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

}
