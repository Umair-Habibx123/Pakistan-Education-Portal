import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { UniversityService } from 'libs/service/addUniversity/university.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environments';
import { UserSessionService } from 'libs/service/userSession/userSession.service';

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
    private adduniversityService: UniversityService,
    private cdRef: ChangeDetectorRef,
    private userSessionService: UserSessionService
  ) { }

  searchTerm: string = '';

  logoPreviewUrl: string | ArrayBuffer | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null;
  selectedLogoFile: File | null = null;
  selectedImageFile: File | null = null;
  errorMessage: string = '';
  user = this.userSessionService.getUser();
  userId = this.user?.userLoginId;

  newUniversity = {
    name: '',
    campus: '',
    city: null as number | null,
    universityID: 0,
    campusID: 0,
  };

  selectedExistingUniversity: any = null;
  universities: any[] = [];
  filteredUniversities: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 9;
  totalPages: number = 0;
  cities: any[] = [];

  selectedUniversity: any = null;
  showDetailView = false;

  ngOnInit(): void {
    this.loadUniversities();
    this.updateFilteredUniversities();
    this.loadCities();
    console.log(this.userId);
  }


  loadUniversities(): void {
    this.adduniversityService.getUniversity(0).subscribe(
      (response) => {
        this.universities = response.filter((universities: any) => !universities.isDeleted);
        this.searchTerm = ''; // Reset search term
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

  searchUniversities(): void {
    if (!this.searchTerm) {
      this.filteredUniversities = [...this.universities];
      this.updateFilteredUniversities();
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredUniversities = this.universities.filter(university => 
      university.universityName.toLowerCase().includes(term) ||
      (university.campusName && university.campusName.toLowerCase().includes(term)) ||
      (university.cityName && university.cityName.toLowerCase().includes(term))
    );
    this.currentPage = 1; 
    this.updateFilteredUniversities();
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
      : Promise.resolve(null);

    const imagePromise = this.selectedImageFile
      ? this.fileToBase64(this.selectedImageFile)
      : Promise.resolve(null);


    Promise.all([logoPromise, imagePromise])
      .then(([logoBase64, imageBase64]) => {
        const universityData = {
          spType: this.newUniversity.universityID !== 0 ? 'update' : 'insert',
          userID: this.userId,
          universityID: this.newUniversity.universityID,
          universityName: this.newUniversity.name,
          campusID: this.newUniversity.campusID,
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
              document.getElementById('closeModal')?.click();
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
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    
    const sourceArray = this.searchTerm ? this.filteredUniversities : this.universities;
    
    this.filteredUniversities = sourceArray.slice(startIndex, endIndex);
    this.totalPages = Math.ceil(sourceArray.length / this.itemsPerPage);
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


  onLogoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.logoPreviewUrl = null;
      this.selectedLogoFile = null;

      const validTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        this.errorMessage = 'Invalid file type. Please upload SVG, PNG, or JPG.';
        this.cdRef.detectChanges();
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        this.errorMessage = 'File size too large. Max 2MB allowed.';
        this.cdRef.detectChanges();
        return;
      }

      this.selectedLogoFile = file;
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.logoPreviewUrl = e.target.result;
        this.errorMessage = '';
        this.cdRef.detectChanges();
      };

      reader.onerror = () => {
        this.errorMessage = 'Error reading logo file';
        this.logoPreviewUrl = null;
        this.cdRef.detectChanges();
      };

      reader.readAsDataURL(file);
    }
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const validTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        this.errorMessage = 'Invalid file type. Please upload SVG, PNG, or JPG.';
        this.cdRef.detectChanges(); // Add this
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        this.errorMessage = 'File size too large. Max 2MB allowed.';
        this.cdRef.detectChanges(); // Add this
        return;
      }

      this.selectedImageFile = file;
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.imagePreviewUrl = e.target.result;
        this.errorMessage = '';
        this.cdRef.detectChanges(); // Add this to update UI immediately
      };

      reader.onerror = () => {
        this.errorMessage = 'Error reading image file';
        this.imagePreviewUrl = null;
        this.cdRef.detectChanges(); // Add this
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
    // Reset all file states first
    this.selectedLogoFile = null;
    this.selectedImageFile = null;
    this.logoPreviewUrl = null;
    this.imagePreviewUrl = null;

    if (this.logoInput?.nativeElement) {
      this.logoInput.nativeElement.value = '';
    }
    if (this.imageInput?.nativeElement) {
      this.imageInput.nativeElement.value = '';
    }

    this.newUniversity = {
      name: university.universityName,
      campus: university.campusName,
      campusID: university.campusID,
      city: university.cityID,
      universityID: university.uniID,
    };


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
        userID: this.userId,
        universityID: university.uniID,
        campusID: university.campusID,
        universityName: university.universityName?.toString() || "",
        campusName: university.campusName?.toString() || "",
        cityID: university.cityID?.toString() || "",
        logoEDoc: "",
        imageEDoc: "",
        logoEDocPath: "",
        logoEDocExt: "",
        imageEDocPath: "",
        imageEDocExt: ""
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
          console.error('Error deleting university:', error.error);
          this.loadUniversities();
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
      universityID: 0,
      campusID: 0
    };
    this.selectedLogoFile = null;
    this.selectedImageFile = null;
    this.selectedExistingUniversity = null;
    this.errorMessage = '';

    if (this.logoInput?.nativeElement) {
      this.logoInput.nativeElement.value = '';
    }
    if (this.imageInput?.nativeElement) {
      this.imageInput.nativeElement.value = '';
    }
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


