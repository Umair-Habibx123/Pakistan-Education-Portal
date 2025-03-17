import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { colors } from 'libs/styles/colors';

interface University {
  name: string;
  image: string;
  logo: string;
  location: string;
  programs: number;
  tuitionFee: string;
  studyLevel: string;
  subject: string;
  city: string;
}

@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss']
})
export class HeroSectionComponent {
  colors = colors;
  
  @Output() filtersApplied = new EventEmitter<boolean>();

  universities: University[] = [
    {
      name: 'Bahauddin Zakariya University',
      image: 'assets/Uni1.png',
      logo: 'assets/Uni1-logo.png',
      location: 'Multan, Punjab',
      programs: 36,
      tuitionFee: '$18k - $19k',
      studyLevel: 'Bachelor’s',
      subject: 'Computer Science',
      city: 'Multan'
    },
    {
      name: 'COMSATS University',
      image: 'assets/Uni2.png',
      logo: 'assets/Uni2-logo.png',
      location: 'Multan, Punjab',
      programs: 36,
      tuitionFee: '$18k - $19k',
      studyLevel: 'Master’s',
      subject: 'Business Administration',
      city: 'Islamabad'
    },
    {
      name: 'University of Punjab',
      image: 'assets/Uni3.png',
      logo: 'assets/Uni3-logo.png',
      location: 'Multan, Punjab',
      programs: 36,
      tuitionFee: '$18k - $19k',
      studyLevel: 'PhD',
      subject: 'Business Administration',
      city: 'Islamabad'
    },
    {
      name: 'University of Central Punjab',
      image: 'assets/Uni4.png',
      logo: 'assets/Uni4-logo.png',
      location: 'Multan, Punjab',
      programs: 36,
      tuitionFee: '$18k - $19k',
      studyLevel: 'PhD',
      subject: 'Business Administration',
      city: 'Islamabad'
    },
  ];

  filteredUniversities: University[] = []; 
  isUniversityPage: boolean = false;

  studyLevels: string[] = [
    'PhD',
    'Master’s',
    'Bachelor’s',
  ];

  subjects: string[] = [
    'Computer Science',
    'Software Engineering',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Business Administration',
    'Medicine',
    'Law',
    'Architecture',
    'Mathematics',
    'Physics'
  ];

  cities: string[] = [
    'Islamabad',
    'Lahore',
    'Karachi',
    'Peshawar',
    'Quetta',
    'Faisalabad',
    'Rawalpindi',
    'Multan',
    'Hyderabad',
    'Sialkot'
  ];

  selectedStudyLevel: string = '';
  selectedSubject: string = '';
  selectedCity: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 16; 
  totalPages: number = 0;

  constructor(private router: Router) {
    this.isUniversityPage = this.router.url === '/universities';
  }

  filterUniversities() {
    this.filteredUniversities = this.universities.filter(university => {
      return (!this.selectedStudyLevel || university.studyLevel === this.selectedStudyLevel) &&
        (!this.selectedSubject || university.subject === this.selectedSubject) &&
        (!this.selectedCity || university.city === this.selectedCity);
    });

    // Emit event based on whether filters are applied
    this.filtersApplied.emit(this.filteredUniversities.length > 0);

    // Reset to the first page after filtering
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredUniversities.length / this.itemsPerPage);
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