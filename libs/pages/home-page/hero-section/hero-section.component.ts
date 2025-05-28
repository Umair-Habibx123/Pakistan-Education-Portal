import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UniversityService } from "libs/service/addUniversity/university.service"
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environments';
import { addprogramService } from 'libs/service/addprogram/addProgram.service';
import { ApplicationDataService } from 'libs/service/applicatinData/applicationData.service';
import { UserSessionService } from 'libs/service/userSession/userSession.service';

interface University {
  universityName: string;
  imageEDoc: string;
  logoEDoc: string;
  cityName: string;
  programs: Program[];
  tuitionFee: string;
  studyLevel: string;
  city: string;
  campusName: string;
  noOfPrograms: number;
  firstName: string,
  email: string,
  designation: string,
  contact: string,
  whatsapp: string,
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


  tempSelectedStudyLevel: any = null;
  tempSelectedSubject: any = null;
  tempSelectedCity: any = null;

  selectedStudyLevel: string = '';
  selectedSubject: string = '';
  selectedCity: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 16;
  totalPages: number = 0;

  selectedUniversity: any = null;
  showDetailView = false;

  studyLevels: any = [];
  subjects: any = [];
  cities: any = [];

  constructor(
    private router: Router,
    private universityService: UniversityService,
    private http: HttpClient,
    private programService: addprogramService,
    private userSessionService: UserSessionService,
    private applicationDataService: ApplicationDataService
  ) {
    this.isUniversityPage = this.router.url === '/universities';
    this.apiURL = environment.apiUrl;
  }

  ngOnInit(): void {
    this.getEducationTypes();
  }

  getEducationTypes() {
    this.programService.getEducationType().subscribe(
      (response) => {
        this.studyLevels = response;
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onStudyLevelChange() {
    this.tempSelectedSubject = null;
    this.tempSelectedCity = null;
    this.subjects = [];
    this.cities = [];

    console.log(this.tempSelectedStudyLevel);

    if (this.tempSelectedStudyLevel) {
      this.getPrograms(this.tempSelectedStudyLevel);
    }
  }

  getPrograms(educationTypeID: string) {
    this.programService.getProgramsForHome(parseInt(educationTypeID)).subscribe(
      (response) => {
        this.subjects = response;
        console.log(this.subjects);
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onSubjectChange() {
    this.tempSelectedCity = null;
    this.cities = [];

    if (this.tempSelectedSubject) {

      const selectedProgramId = parseInt(this.tempSelectedSubject);
      this.cities = this.subjects
        .filter((subject: any) => subject.programID === selectedProgramId)
        .map((subject: any) => ({
          cityID: subject.cityID,
          cityName: subject.cityName
        }));

      this.cities = this.cities.filter(
        (city: any, index: number, self: any[]) =>
          index === self.findIndex((c) => c.cityID === city.cityID)
      );

      console.log('Filtered cities:', this.cities);
    }
  }



  applyFilters() {

    if (!this.tempSelectedStudyLevel || !this.tempSelectedSubject || !this.tempSelectedCity) {
      alert('Please select a Study Level, Subject, and City before searching.');
      return;
    }

    const educationTypeID = parseInt(this.tempSelectedStudyLevel);
    const programID = parseInt(this.tempSelectedSubject);
    const cityID = parseInt(this.tempSelectedCity);


    this.selectedStudyLevel = this.studyLevels.find(
      (level: any) => level.educationTypeID === educationTypeID
    )?.educationTypeTitle || '';

    this.selectedSubject = this.subjects.find(
      (subject: any) => subject.programID === programID
    )?.programName || '';

    this.selectedCity = this.cities.find(
      (city: any) => city.cityID === cityID
    )?.cityName || '';

    const data = {
      studyLevel: this.selectedStudyLevel,
      subject: this.selectedSubject,
    };

    this.applicationDataService.setApplicationData(data);


    this.universityService.getUniversityForHero(educationTypeID, programID, cityID).subscribe(
      (response) => {
        this.filteredUniversities = response;
        console.log("response = ", response);
        this.hasSearched = true;
        this.filtersApplied.emit(this.filteredUniversities.length > 0);
        this.currentPage = 1;
        this.totalPages = Math.ceil(this.filteredUniversities.length / this.itemsPerPage);
      },
      (error) => {
        console.error('Error fetching filtered universities:', error);
        alert('An error occurred while fetching universities. Please try again.');
      }
    );
  }

  showUniversityDetail(university: any) {
    if (this.userSessionService.isLoggedIn()) {
      this.selectedUniversity = university;
      this.showDetailView = true;
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

  goBack() {
    this.showDetailView = false;
    this.selectedUniversity = null;
    window.location.reload();
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