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
  searchTerm: string = '';
  private readonly CAMPUS_REGEX = /^[a-zA-Z0-9\s\-',.()]{2,100}$/;
  private readonly URL_REGEX =/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  private readonly emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private readonly phoneRegex = /^[0-9]{10,15}$/;
  isEditing: boolean = false;
  isLoading: boolean = false;
  isDeleting: boolean = false;
  isSubmitting: boolean = false;
  logoPreviewUrl: string | ArrayBuffer | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null;
  selectedLogoFile: File | null = null;
  selectedImageFile: File | null = null;
  errorMessage: string = '';
  user = this.userSessionService.getUser();
  userId = this.user?.userLoginId;
  selectedExistingUniversity: any = null;
  universities: any[] = [];
  filteredUniversities: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 9;
  totalPages: number = 0;
  cities: any[] = [];
  UniNames: any[] = [];
  countries: any[] = [];
  provinces: any[] = [];
  selectedCountryId: number | null = null;
  selectedProvinceId: number | null = null;
  universityToDelete: any = null;
  selectedUniversity: any = null;
  showDetailView = false;


  newUniversity = {
    name: null,
    campus: '',
    city: null as number | null,
    url: '',
    universityID: 0,
    campusID: 0,
    contactID: 0,
    employeeName: '',
    email: '',
    designation: '',
    contact: '',
    whatsapp: '',
  };

  constructor(
    private snackBar: MatSnackBar,
    private adduniversityService: UniversityService,
    private cdRef: ChangeDetectorRef,
    private userSessionService: UserSessionService
  ) { }

  
  ngOnInit(): void {
  const user = this.userSessionService.getUser();
  if (user?.roleId === 1) {
    this.loadUniversities();
    this.loadCountries();
    this.loadUniversityNames();
  }
  console.log(this.userId);
}


  loadUniversities(): void {
  this.isLoading = true;
  
  const user = this.userSessionService.getUser();
  
  // If user is admin (roleId = 1), load all universities
  if (user?.roleId === 1) {
    this.adduniversityService.getUniversity(0).subscribe(
      (response) => {
        this.isLoading = false;
        this.universities = response.filter(
          (universities: any) => !universities.isDeleted
        );
        this.searchTerm = '';
        this.updateFilteredUniversities();
      },
      (error) => {
        this.isLoading = false;
        console.error('Error fetching universities:', error);
      }
    );
  } else {
    this.isLoading = false;
    this.universities = [];
    this.searchTerm = '';
    this.updateFilteredUniversities();
  }
}

  loadCountries(): void {
    this.isLoading = true;
    this.adduniversityService.getCountries().subscribe(
      (response) => {
        this.isLoading = false;
        this.countries = response;
      },
      (error) => {
        this.isLoading = false;
        console.error('Error fetching countries:', error);
      }
    );
  }

  loadStates(countryId: number, preserveSelection: boolean = false): void {
    this.isLoading = true;
    this.adduniversityService.getStatesByCountry(countryId).subscribe(
      (response) => {
        this.isLoading = false;
        this.provinces = response;
        if (!preserveSelection) {
          this.selectedProvinceId = null;
          this.newUniversity.city = null;
        }
      },
      (error) => {
        this.isLoading = false;
        console.error('Error fetching states:', error);
      }
    );
  }

  loadCitiesByState(
    provinceId: number,
    preserveSelection: boolean = false
  ): void {
    this.isLoading = true;
    this.adduniversityService.getCitiesByState(provinceId).subscribe(
      (response) => {
        this.isLoading = false;
        this.cities = response;
        if (!preserveSelection) {
          this.newUniversity.city = null;
        }
      },
      (error) => {
        this.isLoading = false;
        console.error('Error fetching cities:', error);
      }
    );
  }

  loadUniversityNames(): void {
    this.isLoading = true;
    this.adduniversityService.getUniversityNames().subscribe(
      (response) => {
        this.isLoading = false;

        this.UniNames = response;
      },
      (error) => {
        this.isLoading = false;

        console.error('Error fetching Uni Names:', error);
      }
    );
  }

  onCountryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const countryId = Number(selectElement.value);
    this.selectedCountryId = countryId;
    if (countryId) {
      console.log(countryId);
      this.loadStates(countryId);
    } else {
      this.provinces = [];
      this.cities = [];
      this.selectedProvinceId = null;
      this.newUniversity.city = null;
    }
  }

  onProvinceChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const stateId = Number(selectElement.value);
    this.selectedProvinceId = stateId;
    if (stateId) {
      console.log(stateId);

      this.loadCitiesByState(stateId);
    } else {
      this.cities = [];
      this.newUniversity.city = null;
    }
  }

  searchUniversities(): void {
    if (!this.searchTerm) {
      this.filteredUniversities = [...this.universities];
      this.updateFilteredUniversities();
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredUniversities = this.universities.filter(
      (university) =>
        university.universityName.toLowerCase().includes(term) ||
        (university.campusName &&
          university.campusName.toLowerCase().includes(term)) ||
        (university.cityName &&
          university.cityName.toLowerCase().includes(term))
    );
    this.currentPage = 1;
    this.updateFilteredUniversities();
  }

  onUniversitySelect(uni: any) {
    if (uni) {
      this.newUniversity.universityID = uni.uniID;
      this.newUniversity.name = uni.universityName;
    } else {
      this.newUniversity.universityID = 0;
      this.newUniversity.name = null;
    }
  }

  addUniversity(): void {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    this.isLoading = true;
    this.errorMessage = '';

    const trimmedCampus = this.newUniversity.campus.trim();
    const trimmedUrl = this.newUniversity.url.trim();
    const trimmedEmployeeName = this.newUniversity.employeeName.trim();
    const trimmedEmail = this.newUniversity.email.trim();
    const trimmedDesignation = this.newUniversity.designation.trim();
    const trimmedContact = this.newUniversity.contact.trim();
    const trimmedWhatsapp = this.newUniversity.whatsapp.trim();

    if (
      !this.newUniversity.name ||
      !trimmedCampus ||
      !this.newUniversity.city ||
      !trimmedUrl ||
      !trimmedContact ||
      !trimmedEmail ||
      !trimmedEmployeeName ||
      !trimmedDesignation
    ) {
      this.errorMessage = 'Please fill all required fields with valid values';
      this.isLoading = false;
      this.isSubmitting = false;
      return;
    }

    if (trimmedCampus.length < 2 || trimmedCampus.length > 100) {
      this.errorMessage = 'Campus name must be 2-100 characters long';
      this.isLoading = false;
      this.isSubmitting = false;
      return;
    }

    if (!this.CAMPUS_REGEX.test(trimmedCampus)) {
      this.errorMessage = 'Campus name contains invalid characters';
      this.isLoading = false;
      this.isSubmitting = false;
      return;
    }

    let processedUrl = trimmedUrl;
    if (
      !processedUrl.startsWith('http://') &&
      !processedUrl.startsWith('https://')
    ) {
      processedUrl = 'https://' + processedUrl;
    }

    if (!this.URL_REGEX.test(processedUrl)) {
      this.errorMessage =
        'Please enter a valid website URL (e.g., https://www.example.edu)';
      this.isLoading = false;
      this.isSubmitting = false;
      return;
    }

    if (!this.emailRegex.test(trimmedEmail)) {
      this.errorMessage = 'Please enter a valid email address';
      this.isLoading = false;
      this.isSubmitting = false;
      return;
    }

    if (!this.phoneRegex.test(trimmedContact)) {
      this.errorMessage = 'Please enter a valid contact number';
      this.isLoading = false;
      this.isSubmitting = false;
      return;
    }

    const isEditWithExistingImages =
      this.isEditing &&
      !this.selectedLogoFile &&
      !this.selectedImageFile &&
      this.logoPreviewUrl &&
      this.imagePreviewUrl;

    if (!isEditWithExistingImages) {
      if (!this.selectedLogoFile && !this.logoPreviewUrl) {
        this.errorMessage = 'Please select or keep existing logo';
        this.isLoading = false;
        this.isSubmitting = false;
        return;
      }

      if (!this.selectedImageFile && !this.imagePreviewUrl) {
        this.errorMessage = 'Please select or keep existing image';
        this.isLoading = false;
        this.isSubmitting = false;
        return;
      }
    }

    const logoPromise = this.selectedLogoFile
      ? this.fileToBase64(this.selectedLogoFile)
      : isEditWithExistingImages
        ? Promise.resolve('existing')
        : Promise.resolve(null);

    const imagePromise = this.selectedImageFile
      ? this.fileToBase64(this.selectedImageFile)
      : isEditWithExistingImages
        ? Promise.resolve('existing')
        : Promise.resolve(null);

    Promise.all([logoPromise, imagePromise])
      .then(([logoBase64, imageBase64]) => {
        console.log('Logo base64:', logoBase64 ? 'exists' : 'null');
        console.log('Image base64:', imageBase64 ? 'exists' : 'null');

        const existingUni = this.universities.find(
          (u) => u.uniID === this.newUniversity.universityID
        );

        const universityData: any = {
          spType: this.isEditing ? 'update' : 'insert',
          userID: this.user?.userLoginId,
          universityID: this.newUniversity.universityID,
          universityName: this.newUniversity.name,
          campusID: this.newUniversity.campusID,
          campusName: trimmedCampus,
          url: processedUrl,
          cityID: this.newUniversity.city,
          logoEDoc: logoBase64 === 'existing' ? '' : logoBase64 || '',
          imageEDoc: imageBase64 === 'existing' ? '' : imageBase64 || '',
          logoEDocPath: this.selectedLogoFile
            ? environment.logoUrl
            : existingUni?.logoEDocPath || null,
          logoEDocExt: this.selectedLogoFile
            ? this.getFileExtension(this.selectedLogoFile.name)
            : existingUni?.logoEDocPath?.split('.').pop() || null,
          imageEDocPath: this.selectedImageFile
            ? environment.imageUrl
            : existingUni?.imageEDocPath || null,
          imageEDocExt: this.selectedImageFile
            ? this.getFileExtension(this.selectedImageFile.name)
            : existingUni?.imageEDocPath?.split('.').pop() || null,

          employeeName: trimmedEmployeeName,
          email: trimmedEmail,
          designation: trimmedDesignation,
          contact: trimmedContact,
          whatsapp: trimmedWhatsapp,
        };

        if (this.isEditing && this.newUniversity.contactID) {
          universityData.newContactID = this.newUniversity.contactID;
        }

        console.log('Saving university:', universityData);
        this.adduniversityService.saveUniversity(universityData).subscribe(
          (response) => {
            this.isSubmitting = false;
            this.isLoading = false;
            if (
              Array.isArray(response) &&
              response[0] === 'University already exists'
            ) {
              this.errorMessage = 'A university with this name/campus name already exists';
              this.snackBar.open('University already exists!', 'Close', {
                duration: 5000,
                panelClass: ['error-snackbar'],
              });
            } else {
              this.isSubmitting = false;
              this.isLoading = false;
              console.log('University saved successfully:', response);
              document.getElementById('closeModal')?.click();
              this.snackBar.open(
                this.isEditing
                  ? 'University updated successfully!'
                  : 'University added successfully!',
                'Close',
                {
                  duration: 5000,
                  panelClass: ['success-snackbar'],
                }
              );
              this.resetForm();
              document.getElementById('universityModal')?.click();
              this.loadUniversities();
            }
          },
          (error) => {
            this.isSubmitting = false;
            this.isLoading = false;
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
        this.isSubmitting = false;
        this.isLoading = false;
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
    this.loadUniversities();
    this.showDetailView = false;
    this.selectedUniversity = null;
  }

  updateFilteredUniversities(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    const sourceArray = this.searchTerm
      ? this.filteredUniversities
      : this.universities;

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

      const validTypes = [
        'image/svg+xml',
        'image/png',
        'image/jpeg',
        'image/jpg',
      ];
      if (!validTypes.includes(file.type)) {
        this.errorMessage =
          'Invalid file type. Please upload SVG, PNG, or JPG.';
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
      this.imagePreviewUrl = null;
      this.selectedImageFile = null;

      const validTypes = [
        'image/svg+xml',
        'image/png',
        'image/jpeg',
        'image/jpg',
      ];
      if (!validTypes.includes(file.type)) {
        this.errorMessage =
          'Invalid file type. Please upload SVG, PNG, or JPG.';
        this.cdRef.detectChanges();
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        this.errorMessage = 'File size too large. Max 2MB allowed.';
        this.cdRef.detectChanges();
        return;
      }

      this.selectedImageFile = file;
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.imagePreviewUrl = e.target.result;
        this.errorMessage = '';
        this.cdRef.detectChanges();
      };

      reader.onerror = () => {
        this.errorMessage = 'Error reading image file';
        this.imagePreviewUrl = null;
        this.cdRef.detectChanges();
      };

      reader.readAsDataURL(file);
    }
  }

  editUniversity(university: any) {
    console.log('Editing university:', university);
    this.isEditing = true;
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

    this.selectedUniversity = this.UniNames.find(
      (uni) => uni.uniID === university.uniID
    );

    if (!this.selectedUniversity) {
      this.selectedUniversity = this.UniNames.find(
        (uni) =>
          uni.universityID === university.uniID ||
          uni.uniID === university.universityID ||
          uni.universityID === university.universityID
      );
    }

    // If still not found, try name match (case insensitive)
    if (!this.selectedUniversity) {
      this.selectedUniversity = this.UniNames.find(
        (uni) =>
          uni.universityName?.toLowerCase() ===
          university.universityName?.toLowerCase()
      );
    }

    console.log('Selected university for dropdown:', this.selectedUniversity);

    this.newUniversity = {
      name: university.universityName,
      campus: university.campusName,
      campusID: university.campusID,
      url: university.url,
      city: university.cityID,
      contactID: university.contactID,
      universityID: university.uniID || university.universityID, // Prefer uniID if it exists
      employeeName: university.employeeName,
      email: university.email,
      designation: university.designation,
      contact: university.contact,
      whatsapp: university.whatsapp,
    };

    // Set image previews
    if (university.logoEDocPath) {
      this.logoPreviewUrl = `${this.productUrl}${university.logoEDocPath}`;
    }
    if (university.imageEDocPath) {
      this.imagePreviewUrl = `${this.productUrl}${university.imageEDocPath}`;
    }

    // Parse the cityName to set dropdowns
    if (university.cityName) {
      const [cityName, provinceName, countryName] = university.cityName
        .split(',')
        .map((item: string) => item.trim());

      const country = this.countries.find((c) => c.countryName === countryName);
      if (country) {
        this.selectedCountryId = country.countryID;
        console.log('Found country:', country);

        this.loadStates(country.countryID, true);

        // Use setTimeout to ensure states are loaded before proceeding
        setTimeout(() => {
          const province = this.provinces.find(
            (p) => p.provinceName === provinceName
          );
          if (province) {
            this.selectedProvinceId = province.provinceID;
            console.log('Found province:', province);

            this.loadCitiesByState(province.provinceID, true);

            // Another setTimeout for cities
            setTimeout(() => {
              const city = this.cities.find((c) => c.cityName === cityName);
              if (city) {
                this.newUniversity.city = city.cityID;
                console.log('Found city:', city);
              } else {
                console.warn('City not found:', cityName);
              }
            }, 500);
          } else {
            console.warn('Province not found:', provinceName);
          }
        }, 500);
      } else {
        console.warn('Country not found:', countryName);
      }
    }
  }

  confirmDelete(university: any): void {
    this.universityToDelete = university;
  }

  deleteUniversity(): void {
    this.isDeleting = true;

    if (!this.universityToDelete) return;

    const deleteData = {
      spType: 'delete',
      userID: this.user?.userLoginId,
      universityID: this.universityToDelete.uniID,
      campusID: this.universityToDelete.campusID,
      universityName: this.universityToDelete.universityName?.toString() || '',
      campusName: this.universityToDelete.campusName?.toString() || '',
      cityID: this.universityToDelete.cityID?.toString() || '',
      url: this.universityToDelete.url?.toString() || '',
      logoEDoc: '',
      imageEDoc: '',
      logoEDocPath: '',
      logoEDocExt: '',
      imageEDocPath: '',
      imageEDocExt: '',
      employeeName: this.universityToDelete.employeeName || '',
      email: this.universityToDelete.email || '',
      designation: this.universityToDelete.designation || '',
      contact: this.universityToDelete.contact || '',
      whatsapp: this.universityToDelete.whatsapp || '',
    };

    this.adduniversityService.saveUniversity(deleteData).subscribe(
      (response) => {
        this.isDeleting = false;
        console.log('University deleted successfully:', response);
        this.snackBar.open('University deleted successfully!', 'Close', {
          duration: 5000,
          panelClass: ['success-snackbar'],
        });
        this.loadUniversities();
      },
      (error) => {
        this.isDeleting = false;
        console.error('Error deleting university:', error.error);
        this.loadUniversities();
        this.snackBar.open('Failed to delete university!', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      }
    );
  }

  resetForm() {
    this.isEditing = false;
    this.logoPreviewUrl = null;
    this.imagePreviewUrl = null;
    this.selectedUniversity = null;
    this.selectedCountryId = null;
    this.selectedProvinceId = null;
    this.newUniversity = {
      name: null,
      campus: '',
      city: null,
      universityID: 0,
      url: '',
      campusID: 0,
      contactID: 0,
      employeeName: '',
      email: '',
      designation: '',
      contact: '',
      whatsapp: '',
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
}

