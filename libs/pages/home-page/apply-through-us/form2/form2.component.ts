import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserSessionService } from 'libs/service/userSession/userSession.service';
import { UserInfoService } from 'libs/service/userinfo/user-info.service';
import { environment } from 'src/environments/environments';
import { addprogramService } from 'libs/service/addprogram/addProgram.service';
import { Router } from '@angular/router';

interface DocumentInfo {
  fileName: string;
  filePath: string;
}



@Component({
  selector: 'app-form2',
  templateUrl: './form2.component.html',
  styleUrls: ['./form2.component.scss']
})
export class Form2Component implements OnInit {
  @Output() nextStep = new EventEmitter<void>();

  campusName: string = '';
  courseName: string = '';

  previewData: any = {
    degree: '',
    institutionName: '',
    passingYear: '',
    grading: '',
    totalMarks: '',
    obtainMarks: '',
  };

  isEditing: boolean = false;
  userEducationID: number = 0;
  hasExistingData: boolean = false;
  showForm: boolean = false;

  Degree: Number = 0;
  institutionName: string = '';
  passingYear: number = 0;
  grading: string = '';
  totalMarks: string = '';
  obtainMarks: string = '';

  // File handling
  marksheetFile: File | null = null;
  transcriptFile: File | null = null;
  marksheetBase64: string = '';
  transcriptBase64: string = '';
  existingMarksheet: DocumentInfo | null = null;
  existingTranscript: DocumentInfo | null = null;

  educationType: any[] = [];
  passingYears = [2022, 2023, 2024, 2025];
  gradings = ["Annual"];
  isLoading: boolean = false;

  constructor(
    private userInfoService: UserInfoService,
    private userSessionService: UserSessionService,
    private addprogramService: addprogramService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadEducationType();

    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.campusName = navigation.extras.state['campusName'];
      this.courseName = navigation.extras.state['courseName'];
    }
  }

  loadEducationType(): void {
    this.isLoading = true;
    this.addprogramService.getEducationType().subscribe(
      (response) => {
        this.isLoading = false;
        this.educationType = response;
        this.fetchUserEducationalInfo();
      },
      (error) => {
        this.isLoading = false;
        console.error('Error fetching education types:', error);
      }
    );
  }

  fetchUserEducationalInfo() {
    const currentUser = this.userSessionService.getUser();
    const userId = currentUser?.userLoginId || 0;

    if (userId) {
      this.userInfoService.getUserEducationalInfo(userId).subscribe({
        next: (response) => {
          if (response && response.length > 0) {
            const userEduInfo = response[0];
            this.hasExistingData = true;
            this.userEducationID = userEduInfo.userEducationID;

            const eduType = this.educationType.find(
              type => type.educationTypeID === Number(userEduInfo.degree)
            );

            this.previewData = {

        //         userEducationID: this.userEducationID,
        // degree: '', // Send degree name
        // institutionName: '',
        // passingYear: 0,
        // grading: '',
        // totalMarks: 0,
        // obtainMarks: 0,
        // userID: userId,
        // spType: 'delete',
        // marksSheetEDoc: '',
        // marksSheetEDocExt: '',
        // degreeEDoc: '',
        // degreeEDocExt: '',
        // degreeEDocPath: '',
        // marksSheetEDocPath: '',
        // campusName: '',
        // courseName: '',
        // educationTypeID: 0


              degree: eduType?.educationTypeTitle || userEduInfo.degree,
              institutionName: userEduInfo.institutionName || '',
              passingYear: userEduInfo.passingYear || 0,
              grading: userEduInfo.grading || '',
              totalMarks: userEduInfo.totalMarks || 0,
              obtainMarks: userEduInfo.obtainMarks || 0,
              degreeEDocPath: userEduInfo.degreeEDocPath,
              marksSheetEDocPath: userEduInfo.marksSheetEDocPath
            };

            // Store existing documents info
            if (userEduInfo.marksSheetEDocPath) {
              this.existingMarksheet = {
                fileName: userEduInfo.marksSheetEDocPath.split('/').pop() || 'Marksheet',
                filePath: userEduInfo.marksSheetEDocPath
              };
            }

            if (userEduInfo.degreeEDocPath) {
              this.existingTranscript = {
                fileName: userEduInfo.degreeEDocPath.split('/').pop() || 'Transcript',
                filePath: userEduInfo.degreeEDocPath
              };
            }
          }
        },
        error: (error) => {
          console.error('Error fetching user educational info:', error);
        }
      });
    }
  }

  enableEditing() {
    this.isEditing = true;
    this.showForm = true;

    // Convert degree string to number
    const eduType = this.educationType.find(
      type => type.educationTypeTitle === this.previewData.degree
    );
    this.Degree = eduType?.educationTypeID || 0;
    this.institutionName = this.previewData.institutionName;
    this.passingYear = this.previewData.passingYear;
    this.grading = this.previewData.grading;
    this.totalMarks = this.previewData.totalMarks;
    this.obtainMarks = this.previewData.obtainMarks;

    window.scrollTo(0, 0);
  }

  getDocumentUrl(path: string): string {
    if (path.startsWith('http')) {
      return path;
    }
    return `${environment.apiUrl}/${path}`;
  }

  async onFileSelected(event: any, type: string) {
    const file: File = event.target.files[0];
    if (!file) return;

    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      alert('Only JPEG, PNG, and PDF files are allowed');
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
        // Clear existing marksheet if new one is uploaded
        this.existingMarksheet = null;
      } else if (type === 'transcript') {
        this.transcriptFile = file;
        this.transcriptBase64 = base64String;
        // Clear existing transcript if new one is uploaded
        this.existingTranscript = null;
      }
    } catch (error) {
      console.error('Error converting file to base64:', error);
      alert('Error processing file. Please try again.');
    }
  }

  removeFile(type: string) {
    if (type === 'marksheet') {
      this.marksheetFile = null;
      this.marksheetBase64 = '';
      // Keep existing marksheet if available
    } else if (type === 'transcript') {
      this.transcriptFile = null;
      this.transcriptBase64 = '';
      // Keep existing transcript if available
    }
  }


  cancelEditing() {
    this.isEditing = false;
    this.showForm = false;
    this.resetFormFields();
  }

  resetFormFields() {
    this.Degree = 0;
    this.institutionName = '';
    this.passingYear = 0;
    this.grading = '';
    this.totalMarks = '';
    this.obtainMarks = '';
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



  clearForm() {
    this.Degree = 0;
    this.institutionName = '';
    this.passingYear = 0;
    this.grading = '';
    this.totalMarks = '';
    this.obtainMarks = '';
    this.marksheetFile = null;
    this.transcriptFile = null;
    this.marksheetBase64 = '';
    this.transcriptBase64 = '';
  }

  validateForm(): boolean {
    // Check required fields
    if (!this.institutionName || !this.passingYear || !this.grading ||
      !this.totalMarks || !this.obtainMarks || this.Degree === 0) {
      alert('Please fill all required fields');
      return false;
    }

    // Convert marks to numbers safely
    const total = parseInt(this.totalMarks);
    const obtained = parseInt(this.obtainMarks);

    if (isNaN(total) || isNaN(obtained)) {
      alert('Please enter valid numbers for marks');
      return false;
    }

    if (obtained > total) {
      alert('Obtained marks cannot be greater than total marks');
      return false;
    }

    return true;
  }



  prepareFormData() {
    const currentUser = this.userSessionService.getUser();
    const userId = currentUser?.userLoginId || 0;

    // Find the selected degree from educationType array
    const selectedDegree = this.educationType.find(
      type => type.educationTypeID === this.Degree
    );

    // Determine if we're updating documents
    const updateMarksheet = !!this.marksheetFile;
    const updateTranscript = !!this.transcriptFile;

    console.log('Update Marksheet:', this.marksheetBase64);
    console.log('Update Transcript:', this.transcriptBase64);

    return {
      // degree: this.Degree.toString(),
      degree: selectedDegree?.educationTypeTitle || '', // Send degree name
      institutionName: this.institutionName,
      passingYear: Number(this.passingYear),
      grading: this.grading,
      totalMarks: this.totalMarks,
      obtainMarks: this.obtainMarks,
      userID: userId,
      spType: this.hasExistingData ? 'update' : 'insert',
      marksSheetEDoc: updateMarksheet ? this.marksheetBase64 : '',
      marksSheetEDocExt: updateMarksheet ? this.marksheetFile?.name.split('.').pop() : '',
      degreeEDoc: updateTranscript ? this.transcriptBase64 : '',
      degreeEDocExt: updateTranscript ? this.transcriptFile?.name.split('.').pop() : '',
      degreeEDocPath: this.existingTranscript?.filePath || environment.degreeUrl,
      marksSheetEDocPath: this.existingMarksheet?.filePath || environment.marksSheetUrl,
      campusName: this.campusName || "1",
      courseName: this.courseName || "1",

      educationTypeID: this.Degree,
    };
  }


  goToNext() {
    try {
      if (this.hasExistingData && !this.isEditing) {
        this.nextStep.emit();
        return;
      }

      if (!this.validateForm()) {
        return;
      }

      const formData = this.prepareFormData();
      console.log('Form data:', formData);

      this.userInfoService.saveUserEducationalInfo(formData).subscribe({
        next: (response) => {
          console.log('Success:', response);
          this.hasExistingData = true;
          this.isEditing = false;
          this.fetchUserEducationalInfo();
          this.nextStep.emit();
        },
        error: (error) => {
          console.error('Error:', error);
          alert(`Error: ${error.message || 'Unknown error occurred'}`);
        }
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  }


  deleteEducationInfo() {
    if (confirm('Are you sure you want to delete your personal information?')) {
      const currentUser = this.userSessionService.getUser();
      const userId = currentUser?.userLoginId || 0;

      const formData = {
        userEducationID: this.userEducationID,
        // degree: "", // Send degree name
        // institutionName: "",
        // passingYear: 0,
        // grading: "",
        // totalMarks: 0,
        // obtainMarks: 0,
        userID: userId,
        spType: 'delete',
        // marksSheetEDoc: "",
        // marksSheetEDocExt: "",
        // degreeEDoc: "",
        // degreeEDocExt: "",
        // degreeEDocPath: "",
        // marksSheetEDocPath: "",
        // campusName: "",
        // courseName: "",
        // educationTypeID: 0
      };

      this.userInfoService.deleteUserEducationalInfo(formData).subscribe({
        next: (response) => {
          console.log("data to delete" , formData);
          console.log('Delete response:', response);
          this.resetFormFields();
          this.hasExistingData = false;
        },
        error: (error) => {
          console.error('Delete error:', error);
          alert('Error deleting educational information. Please try again.');
        }
      });
    }
  }

}