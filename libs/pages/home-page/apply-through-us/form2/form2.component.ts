import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserSessionService } from 'libs/service/userSession/userSession.service';
import { UserInfoService } from 'libs/service/userinfo/user-info.service';
import { environment } from 'src/environments/environments';
import { addprogramService } from 'libs/service/addprogram/addProgram.service';

@Component({
  selector: 'app-form2',
  templateUrl: './form2.component.html',
  styleUrls: ['./form2.component.scss']
})
export class Form2Component implements OnInit {
  @Output() nextStep = new EventEmitter<void>();

  Degree: Number = 0;
  InstituteName: string = '';
  year: number | null = null;
  grading: string = '';
  totalmarks: string = '';
  obtainedmarks: string = '';

  // File handling
  marksheetFile: File | null = null;
  transcriptFile: File | null = null;
  marksheetBase64: string = '';
  transcriptBase64: string = '';

  educationType: any[] = [];


  // Dropdown options
  eduType = ["matric", "Inter"];
  years = [2022, 2023, 2024, 2025];
  gradings = ["Annual"];
  isLoading: boolean = false;

  constructor(
    private userInfoService: UserInfoService,
    private userSessionService: UserSessionService,
    private addprogramService: addprogramService
  ) { }
  ngOnInit(): void {
    this.loadEducationType();
  }

  loadEducationType(): void {
    this.isLoading = true;
    this.addprogramService.getEducationType().subscribe(
      (response) => {
        this.isLoading = false;

        this.educationType = response;
      },
      (error) => {
        this.isLoading = false;
    
            console.error('Error fetching education types:', error);
          }
        );
      }

  async onFileSelected(event: any, type: string) {
    const file: File = event.target.files[0];
    if (!file) return;

    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      alert('Only JPEG and PNG files are allowed');
      return;
    }

    // Check file size (e.g., 5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should not exceed 5MB');
      return;
    }

    try {
      const base64String = await this.fileToBase64(file);

      if (type === 'marksheet') {
        this.marksheetFile = file;
        this.marksheetBase64 = base64String;
      } else if (type === 'transcript') {
        this.transcriptFile = file;
        this.transcriptBase64 = base64String;
      }
    } catch (error) {
      console.error('Error converting file to base64:', error);
      alert('Error processing file. Please try again.');
    }
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Remove the data:image/...;base64, prefix
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  }

  removeFile(type: string) {
    if (type === 'marksheet') {
      this.marksheetFile = null;
      this.marksheetBase64 = '';
    } else if (type === 'transcript') {
      this.transcriptFile = null;
      this.transcriptBase64 = '';
    }
  }

  clearForm() {
    this.Degree = 0;
    this.InstituteName = '';
    this.year = null;
    this.grading = '';
    this.totalmarks = '';
    this.obtainedmarks = '';
    this.marksheetFile = null;
    this.transcriptFile = null;
    this.marksheetBase64 = '';
    this.transcriptBase64 = '';
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

  prepareFormData() {
    const currentUser = this.userSessionService.getUser();
    const userId = currentUser?.userLoginId || 0;

    return {
      educationTypeID: this.Degree,
      institutionName: this.InstituteName,
      degree: this.Degree,
      passingYear: this.year?.toString() || '',
      grading: this.grading,
      totalMarks: this.totalmarks,
      obtainedMarks: this.obtainedmarks,
      userID: userId,
      spType: 'insert',
      marksSheetEDoc: this.marksheetBase64 || '',
      marksSheetEDocExt: this.marksheetFile?.name.split('.').pop() || '',
      degreeEDoc: this.transcriptBase64 || '',
      degreeEDocExt: this.transcriptFile?.name.split('.').pop() || '',

      degreeEDocPath: this.transcriptFile
        ? environment.degreeUrl
        : null,


      marksSheetEDocPath: this.marksheetFile
        ? environment.marksSheetUrl
        : null,

      campusName: 'Main Campus', // Default value or get from form if available
      courseName: this.Degree // Using degree as course name or get from form if available
    };
  }

  goToNext() {
    if (this.validateForm()) {
      const formData = this.prepareFormData();

      console.log('Sending data:', formData);

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