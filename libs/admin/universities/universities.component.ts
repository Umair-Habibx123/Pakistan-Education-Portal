import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UniversityDataService } from '../../service/UniversityData/university-data.service';
import { UniversityService } from 'libs/service/addUniversity/university.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-universities',
  templateUrl: './universities.component.html',
  styleUrls: ['./universities.component.scss'],
})
export class UniversitiesComponent implements OnInit {
  @ViewChild('logoInput') logoInput!: ElementRef;
  @ViewChild('imageInput') imageInput!: ElementRef;

  public productUrl = environment.productUrl;

  constructor(
    private snackBar: MatSnackBar,
    private universityService: UniversityDataService,
    private adduniversityService: UniversityService
  ) {}

  logoPreviewUrl: string | ArrayBuffer | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null;
  selectedLogoFile: File | null = null;
  selectedImageFile: File | null = null;
  errorMessage: string = '';

  universityOption: 'new' | 'existing' = 'new';
  newUniversity = {
    name: '',
    campus: '',
    city: null as number | null, // Update this line
  };
  selectedExistingUniversity: any = null;
  universities: any[] = [];
  filteredUniversities: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 9;
  totalPages: number = 0;
  cities: any[] = [];

  existingUniversities = [
    { id: 1, name: 'COMSATS University' },
    { id: 2, name: 'Quaid-i-Azam University' },
    { id: 3, name: 'Lahore University of Management Sciences' },
    { id: 4, name: 'University of the Punjab' },
    { id: 5, name: 'National University of Sciences and Technology' },
  ];

  selectedUniversity: any = null;
  showDetailView = false;

  ngOnInit(): void {
    // this.universities = this.universityService.getUniversities();
    this.loadUniversities(); // get distinct universities
    this.updateFilteredUniversities();
    this.loadCities(); // Call the method to load cities
  }

  // display saved universities
  loadUniversities(): void {
    this.adduniversityService.getUniversity(0).subscribe(
      (response) => {
        this.universities = response;
        console.log(response);
        this.updateFilteredUniversities();
      },
      (error) => {
        console.error('Error fetching universities:', error);
      }
    );
  }

  // Add this method to load cities from API
  loadCities(): void {
    this.adduniversityService.getCities().subscribe(
      (response) => {
        this.cities = response;
        console.log(response);
      },
      (error) => {
        console.error('Error fetching cities:', error);
      }
    );
  }

  onUniversityOptionChange() {
    this.newUniversity = {
      name: '',
      campus: '',
      city: null,
    };
    this.selectedExistingUniversity = null;
  }

  addUniversity(): void {
    this.errorMessage = '';

    if (this.universityOption === 'new') {
      if (
        !this.newUniversity.name ||
        !this.newUniversity.campus ||
        !this.newUniversity.city
      ) {
        this.errorMessage = 'Please fill all required fields';
        return;
      }

      if (!this.selectedLogoFile || !this.selectedImageFile) {
        this.errorMessage = 'Please select image and logo....';
        return;
      }

      const logoPromise = this.selectedLogoFile
        ? this.fileToBase64(this.selectedLogoFile)
        : Promise.resolve(null);
      const imagePromise = this.selectedImageFile
        ? this.fileToBase64(this.selectedImageFile)
        : Promise.resolve(null);

      Promise.all([logoPromise, imagePromise])
        .then(([logoBase64, imageBase64]) => {
          const universityData = {
            spType: 'insert',
            userID: 1,
            universityName: this.newUniversity.name,
            campusName: this.newUniversity.campus,
            cityID: this.newUniversity.city,
            logoEDoc: logoBase64,
            imageEDoc: imageBase64,
            logoEDocPath: this.selectedLogoFile ? 'C:/university/logos' : null,
            logoEDocExt: this.selectedLogoFile
              ? this.getFileExtension(this.selectedLogoFile.name)
              : null,
            imageEDocPath: this.selectedImageFile
              ? 'C:/university/images'
              : null,
            imageEDocExt: this.selectedImageFile
              ? this.getFileExtension(this.selectedImageFile.name)
              : null,
          };

          console.log('Adding new university:', universityData);
          this.adduniversityService.saveUniversity(universityData).subscribe(
            (response) => {
              console.log('University saved successfully:', response);
              this.snackBar.open('University saved successfully!', 'Close', {
                duration: 5000,
                panelClass: ['custom-snackbar', 'success-snackbar'],
                verticalPosition: 'top',
                horizontalPosition: 'right',
              });
              this.resetForm();
              document.getElementById('universityModal')?.click();
            },
            (error) => {
              console.error('Error saving university:', error);
              this.errorMessage = 'Error saving university. Please try again.';

              // Error snackbar
              this.snackBar.open('Error saving university!', 'Close', {
                duration: 5000,
                panelClass: ['custom-snackbar', 'error-snackbar'],
                verticalPosition: 'top',
                horizontalPosition: 'right',
              });
            }
          );
        })
        .catch((error) => {
          console.error('Error converting files to Base64:', error);
          this.errorMessage = 'Error processing files. Please try again.';
          this.snackBar.open('Error processing files!', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        });
    } else {
      // Validate for existing university case
      if (
        !this.selectedExistingUniversity ||
        !this.newUniversity.campus ||
        !this.newUniversity.city
      ) {
        this.errorMessage = 'Please fill all required fields';
        return;
      }

      console.log(
        'Adding campus to existing university:',
        this.selectedExistingUniversity,
        this.newUniversity
      );
      this.snackBar.open('Campus added successfully!', 'Close', {
        duration: 5000,
        panelClass: ['success-snackbar'],
      });
      // Reset form and close modal
      this.resetForm();
      document.getElementById('universityModal')?.click();
    }
  }

  fileToBase64(file: File): Promise<string | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (!reader.result) {
          resolve(null);
          return;
        }
        const base64String = reader.result.toString().split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  }

  private getFileExtension(filename: string): string {
    return filename.split('.').pop() || '';
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
    console.log('data:' + this.universities);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredUniversities = this.universities.slice(startIndex, endIndex);
    this.totalPages = Math.ceil(this.universities.length / this.itemsPerPage);
    console.log('uni:' + this.filteredUniversities);
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

  getUploadedFiles(): { logo?: File; image?: File } {
    return {
      logo: this.selectedLogoFile || undefined,
      image: this.selectedImageFile || undefined,
    };
  }

  resetForm() {
    this.logoPreviewUrl = null;
    this.imagePreviewUrl = null;
    this.newUniversity.name = '';
    this.newUniversity.campus = '';
    this.newUniversity.city = null;
    this.selectedExistingUniversity = null;
    this.universityOption = 'new';
  }
}
