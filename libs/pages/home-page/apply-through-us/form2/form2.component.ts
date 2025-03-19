import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-form2',
  templateUrl: './form2.component.html',
  styleUrls: ['./form2.component.scss']
})
export class Form2Component {

  @Output() nextStep = new EventEmitter<void>();

  // Declaration of Form fields
  University: string = '';
  Degree: string = '';
  language: string = ''; // This should be 'course' to match the HTML, but since the HTML uses 'language', we'll keep it as is.
  InsttuteName: string = '';

  // Dropdown options
  Universities = ['NUML', 'NUST', 'COMSATS'];
  degree = ['Bachelor of Science', 'Master of Science', 'PhD'];
  course = ['Computer Science', 'Business Administration', 'Economics'];

  validateForm(): boolean {
    // Validate University
    if (!this.University) {
      alert('Please select a university');
      return false;
    }

    // Validate Degree
    if (!this.Degree) {
      alert('Please select a degree');
      return false;
    }

    // Validate Course (language in the HTML)
    if (!this.language) {
      alert('Please select a course');
      return false;
    }

    // Validate Institute Name
    if (this.InsttuteName.length < 3) {
      alert('Please enter a valid institute name');
      return false;
    }

    return true;
  }

  goToNext() {
    if (this.validateForm()) {
      this.nextStep.emit();
    }
  }
}