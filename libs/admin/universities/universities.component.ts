import { Component, OnInit } from '@angular/core';
import { UniversityDataService } from '../../service/UniversityData/university-data.service';


@Component({
  selector: 'app-universities',
  templateUrl: './universities.component.html',
  styleUrls: ['./universities.component.scss']
})
export class UniversitiesComponent implements OnInit {

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
  constructor(private universityService: UniversityDataService) {}

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
}