import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  currentStep = 1;

  nextStep() {
    if (this.currentStep < 2) {
      this.currentStep++;
    }
  }
}
