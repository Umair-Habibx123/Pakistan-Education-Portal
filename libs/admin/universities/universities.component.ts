import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UniversityDataService } from '../../service/UniversityData/university-data.service';
import { UniversityService } from 'libs/service/addUniversity/university.service';


@Component({
  selector: 'app-universities',
  templateUrl: './universities.component.html',
  styleUrls: ['./universities.component.scss']
})
export class UniversitiesComponent implements OnInit {
  apiUrl: any;


  constructor(private universityService: UniversityDataService, private adduniversityService: UniversityService) { }

  @ViewChild('logoInput') logoInput!: ElementRef;
  @ViewChild('imageInput') imageInput!: ElementRef;

  logoPreviewUrl: string | ArrayBuffer | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null;
  selectedLogoFile: File | null = null;
  selectedImageFile: File | null = null;


  universityOption: 'new' | 'existing' = 'new';
  newUniversity = {
    name: '',
    campus: '',
    location: null
  };
  selectedExistingUniversity: any = null;
  universities: any[] = [];
  filteredUniversities: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 9;
  totalPages: number = 0;


  existingUniversities = [
    { id: 1, name: 'COMSATS University' },
    { id: 2, name: 'Quaid-i-Azam University' },
    { id: 3, name: 'Lahore University of Management Sciences' },
    { id: 4, name: 'University of the Punjab' },
    { id: 5, name: 'National University of Sciences and Technology' }
  ];

  selectedUniversity: any = null;
  showDetailView = false;

  ngOnInit(): void {
    this.universities = this.universityService.getUniversities();
    this.updateFilteredUniversities();
  }


  onUniversityOptionChange() {
    this.newUniversity = {
      name: '',
      campus: '',
      location: null
    };
    this.selectedExistingUniversity = null;
  }

  

  addUniversity(): void {
    if (this.universityOption === 'new') {

      const logoPromise = this.selectedLogoFile ? this.fileToBase64(this.selectedLogoFile) : Promise.resolve(null);
      const imagePromise = this.selectedImageFile ? this.fileToBase64(this.selectedImageFile) : Promise.resolve(null);
  
      Promise.all([logoPromise, imagePromise]).then(([logoBase64, imageBase64]) => {
        const universityData = {
          spType: "insert",
          universityName: this.newUniversity.name,
          campusName: this.newUniversity.campus,
          cityID: 1,
          logoEDoc: logoBase64,
          imageEDoc: imageBase64,
          logoEDocPath: this.selectedLogoFile ? "D:/aims projects/pakistan eduction/PEP-Front-End/university/logos" : null,
          logoEDocExt: this.selectedLogoFile ? this.getFileExtension(this.selectedLogoFile.name) : null,
          imageEDocPath: this.selectedImageFile ? "D:/aims projects/pakistan eduction/PEP-Front-End/university/logos": null,
          imageEDocExt: this.selectedImageFile ? this.getFileExtension(this.selectedImageFile.name) : null,
        };


        const Data = {
          spType: "insert",
          universityName: this.newUniversity.name,
          campusName: this.newUniversity.campus,
          cityID: 1,
          logoEDoc: logoBase64,
          imageEDoc: imageBase64,
          logoEDocPath: this.selectedLogoFile ? "D:/aims projects/pakistan eduction/PEP-Front-End/university/logos" : null,
          logoEDocExt: this.selectedLogoFile ? this.getFileExtension(this.selectedLogoFile.name) : null,
          imageEDocPath: this.selectedImageFile ? "D:/aims projects/pakistan eduction/PEP-Front-End/university/logos" : null,
          imageEDocExt: this.selectedImageFile ? this.getFileExtension(this.selectedImageFile.name) : null,
        };


  
        console.log('Adding new university:', universityData);
        this.adduniversityService.saveUniversity(universityData).subscribe(
          (response) => {
            console.log('University saved successfully:', response);
          },
          (error) => {
            console.error('Error saving university:', error);
          }
        );
      }).catch(error => {
        console.error('Error converting files to Base64:', error);
      });
    } else {
      console.log('Adding campus to existing university:', this.selectedExistingUniversity, this.newUniversity);
    }
  }


  
  // Helper function to convert file to Base64 with proper typing
  fileToBase64(file: File): Promise<string | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (!reader.result) {
          resolve(null);
          return;
        }
        // Remove the data URL prefix (e.g., "data:image/png;base64,")
        const base64String = reader.result.toString().split(',')[1];
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  }
  


  private getFileExtension(filename: string): string {
    return filename.split('.').pop() || '';
  }

  private uploadLogoFile(universityID: string) {
    if (!this.selectedLogoFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedLogoFile);
    formData.append('universityID', universityID);
    formData.append('path', 'university/logos');
  }


  showUniversityDetail(university: any) {
    this.selectedUniversity = university;
    this.showDetailView = true;
  }

  goBack() {
    this.showDetailView = false;
    this.selectedUniversity = null;
  }

  updateFilteredUniversities(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredUniversities = this.universities.slice(startIndex, endIndex);
    this.totalPages = Math.ceil(this.universities.length / this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateFilteredUniversities();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateFilteredUniversities();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateFilteredUniversities();
    }
  }



  triggerLogoUpload() {
    this.logoInput.nativeElement.click();
  }

  triggerImageUpload() {
    this.imageInput.nativeElement.click();
  }

  onLogoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.handleFileSelection(input, 'logo');
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.handleFileSelection(input, 'image');
  }

  private handleFileSelection(input: HTMLInputElement, type: 'logo' | 'image') {
    if (input.files && input.files.length > 0) {
      const file = input.files[0];


      const validTypes = ['image/svg+xml', 'image/png', 'image/jpeg'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (SVG, PNG, JPG)');
        return;
      }


      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('File size should not exceed 2MB');
        return;
      }


      const reader = new FileReader();
      reader.onload = (e) => {
        if (type === 'logo') {
          this.logoPreviewUrl = e.target?.result as string;
          this.selectedLogoFile = file;
        } else {
          this.imagePreviewUrl = e.target?.result as string;
          this.selectedImageFile = file;
        }
      };
      reader.readAsDataURL(file);
    }
  }


  getUploadedFiles(): { logo?: File, image?: File } {
    return {
      logo: this.selectedLogoFile || undefined,
      image: this.selectedImageFile || undefined
    };
  }

  resetForm() {
    this.logoPreviewUrl = null;
    this.imagePreviewUrl = null;
    this.newUniversity.name = '';
    this.newUniversity.campus = '';
    this.newUniversity.location = null;
    this.selectedExistingUniversity = null;
    this.universityOption = "new"
  }
}
