import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  standalone : true,
  imports: [MatFormFieldModule, MatInputModule, MatIconModule],
  styleUrls: ['./admin-login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLoginComponent {
  showPassword: boolean = false; // Tracks password visibility

  // Toggles password visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

}