import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { UniversityDataService } from '../../../service/UniversityData/university-data.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environments';

interface University {
  name: string;
  image: string;
  logo: string;
  location: string;
  programs: Program[];
  tuitionFee: string;
  studyLevel: string;
  city: string;
  programsCount: number;
}

interface Program {
  name: string;
  degreeLevel: string;
  applicationFee: string;
  duration: string;
}

@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss'],
})
export class HeroSectionComponent implements OnInit {
  @Output() filtersApplied = new EventEmitter<boolean>();

  apiURL: string = '';
  universities: any[] = [];
  filteredUniversities: University[] = [];
  isUniversityPage: boolean = false;
  hasSearched: boolean = false;

  // Temporary variables for dropdown selections
  tempSelectedStudyLevel: string = '';
  tempSelectedSubject: string = '';
  tempSelectedCity: string = '';

  selectedStudyLevel: string = '';
  selectedSubject: string = '';
  selectedCity: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 16;
  totalPages: number = 0;

  selectedUniversity: any = null;
  showDetailView = false;

  studyLevels: any = [];
  // studyLevels: string[] = ['PhD', 'Master’s', 'Bachelor’s'];

  subjects: any = [];

  cities: any = [];

  constructor(
    private router: Router,
    private universityDataService: UniversityDataService,
    private http: HttpClient
  ) {
    this.isUniversityPage = this.router.url === '/universities';
    this.apiURL = environment.apiUrl;
  }

  ngOnInit(): void {
    this.universities = this.universityDataService.getUniversities();
    this.getEductionTypes();
    this.getCities();
    this.getPrograms();
  }

  getEductionTypes() {
    this.http
      .get(this.apiURL + 'school-api/program/getEducationType')
      .subscribe(
        (response) => {
          this.studyLevels = response;
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  getCities() {
    this.http.get(this.apiURL + 'school-api/university/getCity').subscribe(
      (response) => {
        this.cities = response;
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getPrograms() {
    this.http.get(this.apiURL + 'school-api/program/getPrograms').subscribe(
      (response) => {
        this.subjects = response;
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  applyFilters() {
    // debugger;
    if (!this.tempSelectedStudyLevel) {
      alert('Please select a Study Level before searching.');
      return;
    }

    this.selectedStudyLevel = this.tempSelectedStudyLevel;
    this.selectedSubject = this.tempSelectedSubject;
    this.selectedCity = this.tempSelectedCity;

    this.hasSearched = true;

    this.filterUniversities();
  }

  showUniversityDetail(university: any) {
    this.selectedUniversity = university;
    this.showDetailView = true;
  }

  goBack() {
    this.showDetailView = false;
    this.selectedUniversity = null;
    window.location.reload(); // Reloads the entire page
  }

  filterUniversities() {
    this.filteredUniversities = this.universities.filter(
      (university: University) => {
        const matchesStudyLevel =
          !this.selectedStudyLevel ||
          university.studyLevel === this.selectedStudyLevel;
        const matchesCity =
          !this.selectedCity || university.city === this.selectedCity;
        const matchesSubject =
          !this.selectedSubject ||
          university.programs.some(
            (program: Program) => program.name === this.selectedSubject
          );

        return matchesStudyLevel && matchesCity && matchesSubject;
      }
    );

    this.filtersApplied.emit(this.filteredUniversities.length > 0);

    this.currentPage = 1;
    this.totalPages = Math.ceil(
      this.filteredUniversities.length / this.itemsPerPage
    );
  }

  getPaginatedUniversities(): University[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredUniversities.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
