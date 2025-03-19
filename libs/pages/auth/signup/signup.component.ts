import { Component } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  showPassword: boolean = false; // Tracks password visibility

  // Toggles password visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
