import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  showPassword: boolean = false; // Tracks password visibility

  // Toggles password visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}