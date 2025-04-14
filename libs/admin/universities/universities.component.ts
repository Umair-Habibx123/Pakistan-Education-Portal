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
  ) { }

  logoPreviewUrl: string | ArrayBuffer | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null;
  selectedLogoFile: File | null = null;
  selectedImageFile: File | null = null;
  errorMessage: string = '';

  newUniversity = {
    name: '',
    campus: '',
    city: null as number | null,
    universityID: 0,

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

    this.loadUniversities();
    this.updateFilteredUniversities();
    this.loadCities();
  }


  loadUniversities(): void {
    this.adduniversityService.getUniversity(0).subscribe(
      (response) => {
        this.universities = response.filter((universities: any) => !universities.isDeleted);
        console.log(response);
        this.updateFilteredUniversities();
      },
      (error) => {
        console.error('Error fetching universities:', error);
      }
    );
  }

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

  addUniversity(): void {
    this.errorMessage = '';
    if (
      !this.newUniversity.name ||
      !this.newUniversity.campus ||
      !this.newUniversity.city
    ) {
      this.errorMessage = 'Please fill all required fields';
      return;
    }
  
    if (!this.selectedLogoFile && !this.logoPreviewUrl) {
      this.errorMessage = 'Please select or keep existing logo';
      return;
    }
  
    if (!this.selectedImageFile && !this.imagePreviewUrl) {
      this.errorMessage = 'Please select or keep existing image';
      return;
    }
  
    const logoPromise = this.selectedLogoFile
      ? this.fileToBase64(this.selectedLogoFile)
      : this.logoPreviewUrl?.toString().includes('base64')
        ? Promise.resolve(this.logoPreviewUrl.toString().split(',')[1])
        : Promise.resolve(null);
  
    const imagePromise = this.selectedImageFile
      ? this.fileToBase64(this.selectedImageFile)
      : this.imagePreviewUrl?.toString().includes('base64')
        ? Promise.resolve(this.imagePreviewUrl.toString().split(',')[1])
        : Promise.resolve(null);
  
    Promise.all([logoPromise, imagePromise])
      .then(([logoBase64, imageBase64]) => {
        const universityData = {
          spType: this.newUniversity.universityID !== 0 ? 'update' : 'insert',
          userID: 1,
          universityID: this.newUniversity.universityID,
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
  
        console.log('Saving university:', universityData);
        this.adduniversityService.saveUniversity(universityData).subscribe(
          (response) => {
            if (Array.isArray(response) && response[0] === 'University already exists') {
              this.errorMessage = 'A university with this name already exists';
              this.snackBar.open('University already exists!', 'Close', {
                duration: 5000,
                panelClass: ['error-snackbar'],
              });
            } else {
              console.log('University saved successfully:', response);
              this.snackBar.open(
                this.newUniversity.universityID === 0 
                  ? 'University added successfully!' 
                  : 'University updated successfully!', 
                'Close', {
                duration: 5000,
                panelClass: ['success-snackbar'],
              });
              this.resetForm();
              document.getElementById('universityModal')?.click();
              this.loadUniversities();
            }
          },
          (error) => {
            console.error('Error saving university:', error);
            this.errorMessage = 'Error saving university. Please try again.';
            this.snackBar.open('Error saving university!', 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar'],
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


  editUniversity(university: any) {
    this.newUniversity = {
      name: university.universityName,
      campus: university.campusName,
      city: university.cityID,
      universityID: university.uniID,
    };

    if (!this.selectedLogoFile && !this.logoPreviewUrl) {
      this.errorMessage = 'Please select or keep existing logo';
      return;
    }

    if (!this.selectedImageFile && !this.imagePreviewUrl) {
      this.errorMessage = 'Please select or keep existing image';
      return;
    }

    if (university.logoEDocPath) {
      this.logoPreviewUrl = `${this.productUrl}${university.logoEDocPath}`;
    }
    if (university.imageEDocPath) {
      this.imagePreviewUrl = `${this.productUrl}${university.imageEDocPath}`;
    }
  }

  deleteUniversity(university: any): void {
    if (confirm('Are you sure you want to delete this University?')) {
      const deleteData = {
        spType: 'delete',
        userID: 1,
        universityID: university.uniID,
        universityName: university.universityName.toString(),
        campusName: university.campusName.toString(),
        cityID: university.cityID.toString(),
        isDeleted: 1,
        logoEDoc: university.logoEDoc.toString(),
        imageEDoc: university.imageEDoc.toString(),
        logoEDocPath: university.logoEDocPath.toString(),
        logoEDocExt: university.logoEDocExt,
        imageEDocPath: university.imageEDocPath.toString(),
        imageEDocExt: university.imageEDocExt
      };
  
      this.adduniversityService.saveUniversity(deleteData).subscribe(
        (response) => {
          console.log('University deleted successfully:', response);
          this.snackBar.open('University deleted successfully!', 'Close', {
            duration: 5000,
            panelClass: ['success-snackbar'],
          });
          this.loadUniversities();
        },
        (error) => {
          console.error('Error deleting university:', error);
          this.snackBar.open('Failed to delete university!', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        }
      );
    }
  }

  resetForm() {
    this.logoPreviewUrl = null;
    this.imagePreviewUrl = null;
    this.newUniversity = {
      name: '',
      campus: '',
      city: null,
      universityID: 0
    };
    this.selectedLogoFile = null;
    this.selectedImageFile = null;
    this.selectedExistingUniversity = null;
  }

  clearLogo() {
    this.logoPreviewUrl = null;
    this.selectedLogoFile = null;
    this.logoInput.nativeElement.value = '';
  }

  clearImage() {
    this.imagePreviewUrl = null;
    this.selectedImageFile = null;
    this.imageInput.nativeElement.value = '';
  }
}
