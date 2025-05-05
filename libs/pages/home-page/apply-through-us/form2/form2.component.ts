import { Component, EventEmitter, Output } from '@angular/core';
import { UserSessionService } from 'libs/service/userSession/userSession.service';
import { UserInfoService } from 'libs/service/userinfo/user-info.service';

@Component({
  selector: 'app-form2',
  templateUrl: './form2.component.html',
  styleUrls: ['./form2.component.scss']
})
export class Form2Component {
  @Output() nextStep = new EventEmitter<void>();

  // Form fields
  Degree: string = '';
  InstituteName: string = '';
  year: number | null = null;
  grading: string = '';
  totalmarks: string = '';
  obtainedmarks: string = '';

  // File handling
  marksheetFile: File | null = null;
  transcriptFile: File | null = null;

  // Dropdown options
  eduType = ["matric", "Inter"];
  years = [2022, 2023, 2024, 2025];
  gradings = ["Annual"];

  constructor(
    private userInfoService: UserInfoService,
    private userSessionService: UserSessionService
  ) { }

  onFileSelected(event: any, type: string) {
    const file: File = event.target.files[0];
    if (file) {
      if (type === 'marksheet') {
        this.marksheetFile = file;
      } else if (type === 'transcript') {
        this.transcriptFile = file;
      }
    }
  }

  removeFile(type: string) {
    if (type === 'marksheet') {
      this.marksheetFile = null;
    } else if (type === 'transcript') {
      this.transcriptFile = null;
    }
  }

  clearForm() {
    this.Degree = '';
    this.InstituteName = '';
    this.year = null;
    this.grading = '';
    this.totalmarks = '';
    this.obtainedmarks = '';
    this.marksheetFile = null;
    this.transcriptFile = null;
  }

  validateForm(): boolean {
    if (!this.Degree || !this.InstituteName || !this.year || !this.grading ||
      !this.totalmarks || !this.obtainedmarks) {
      alert('Please fill all required fields');
      return false;
    }

    if (parseInt(this.obtainedmarks) > parseInt(this.totalmarks)) {
      alert('Obtained marks cannot be greater than total marks');
      return false;
    }

    return true;
  }

  prepareFormData(): FormData {
    const currentUser = this.userSessionService.getUser();
    const userId = currentUser?.userLoginId || 0;

    const formData = new FormData();

    formData.append('userEducationID', '0');
    formData.append('institutionName', this.InstituteName);
    formData.append('degree', this.Degree);
    formData.append('passingYear', this.year?.toString() || '');
    formData.append('gradingSystem', this.grading);
    formData.append('totalMarks', this.totalmarks);
    formData.append('obtainedMarks', this.obtainedmarks);
    formData.append('userID', userId.toString());
    formData.append('spType', 'insert');

    // Add files if they exist
    if (this.marksheetFile) {
      formData.append('marksheet', this.marksheetFile);
    }
    if (this.transcriptFile) {
      formData.append('transcript', this.transcriptFile);
    }

    return formData;
  }

  goToNext() {
    if (this.validateForm()) {
      const formData = this.prepareFormData();

      console.log('Sending data:', {
        InstituteName: this.InstituteName,
        Degree: this.Degree,
        year: this.year,
        grading: this.grading,
        totalmarks: this.totalmarks,
        obtainedmarks: this.obtainedmarks,
        hasMarksheet: !!this.marksheetFile,
        hasTranscript: !!this.transcriptFile
      });

      this.userInfoService.saveUserEducationalInfo(formData).subscribe({
        next: (response) => {
          console.log('API response:', response);
          this.nextStep.emit();
        },
        error: (error) => {
          console.error('API error:', error);
          alert('Error saving education information. Please try again.');
        }
      });
    }
  }
}