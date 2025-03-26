import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UniversityDataService } from '../../service/UniversityData/university-data.service';


@Component({
  selector: 'app-universities',
  templateUrl: './universities.component.html',
  styleUrls: ['./universities.component.scss']
})
export class UniversitiesComponent implements OnInit {


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
  constructor(private universityService: UniversityDataService) { }

  ngOnInit(): void {
    this.universities = this.universityService.getUniversities();
    this.updateFilteredUniversities();
  }


  onUniversityOptionChange() {
    // Reset selections when changing options
    this.newUniversity = {
      name: '',
      campus: '',
      location: null
    };
    this.selectedExistingUniversity = null;
  }



  addUniversity() {
    if (this.universityOption === 'new') {
      console.log('Adding new university:', this.newUniversity);
    } else {
      console.log('Adding campus to existing university:', this.selectedExistingUniversity, this.newUniversity);
    }
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

      // Validate file type
      const validTypes = ['image/svg+xml', 'image/png', 'image/jpeg'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (SVG, PNG, JPG)');
        return;
      }

      // Validate file size (example: 2MB max)
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        alert('File size should not exceed 2MB');
        return;
      }

      // Create preview
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

  // Function to get the uploaded files
  getUploadedFiles(): { logo?: File, image?: File } {
    return {
      logo: this.selectedLogoFile || undefined,
      image: this.selectedImageFile || undefined
    };
  }
}