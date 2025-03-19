import { Component } from '@angular/core';

@Component({
  selector: 'app-apply-through-us',
  templateUrl: './apply-through-us.component.html',
  styleUrls: ['./apply-through-us.component.scss']
})
export class ApplyThroughUSComponent {
  currentStep = 1;

  nextStep() {
    if (this.currentStep < 2) {
      this.currentStep++;
    }
  }
}