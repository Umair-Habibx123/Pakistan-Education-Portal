import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UniversityService } from 'libs/service/addUniversity/university.service';
import { environment } from 'src/environments/environments';
import { UserSessionService } from 'libs/service/userSession/userSession.service';

@Component({
  selector: 'app-partner-universities',
  templateUrl: './partner-universities.component.html',
  styleUrls: ['./partner-universities.component.scss']
})
export class PartnerUniversitiesComponent implements OnInit {
  universities: any[] = [];
  filteredUniversities: any[] = [];
  public productUrl = environment.productUrl;
  isUniversityPage: boolean = false;

  currentPage: number = 1;
  itemsPerPage: number = 12;
  totalPages: number = 1;
  totalItems: number = 0;
  selectedUniversity: any = null;
  showDetailView: boolean = false;

  constructor(
    private router: Router,
    private universityService: UniversityService,
    private userSessionService: UserSessionService
  ) {
    this.isUniversityPage = this.router.url === '/universities';
    this.itemsPerPage = this.isUniversityPage ? 12 : 8;
  }

  ngOnInit(): void {
    this.loadUniversities();
  }

  loadUniversities(): void {
    this.universityService.getUniversity(0).subscribe(
      (response) => {
        this.universities = response.filter((university: any) => !university.isDeleted);
        this.totalItems = this.universities.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.updateFilteredUniversities();
      },
      (error) => {
        console.error('Error fetching universities:', error);
      }
    );
  }

  updateFilteredUniversities(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredUniversities = this.universities.slice(startIndex, endIndex);
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

  showUniversityDetail(university: any): void {
    if (this.userSessionService.isLoggedIn()) {
      this.selectedUniversity = university;
      this.showDetailView = true;
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

  goBackToList(): void {
    this.showDetailView = false;
    this.selectedUniversity = null;
  }

  
  getVisiblePages(): number[] {
    const visiblePages = [];
    const maxVisible = 5; 

    if (this.totalPages <= 5) {
      for (let i = 2; i < this.totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      
      const start = Math.max(2, this.currentPage - maxVisible);
      const end = Math.min(this.totalPages - 1, this.currentPage + maxVisible);

      for (let i = start; i <= end; i++) {
        visiblePages.push(i);
      }
    }

    return visiblePages;
  }
}