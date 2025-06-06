import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; // Import the Location service
import { addprogramService } from "libs/service/addprogram/addProgram.service"
import { UniversityService } from 'libs/service/addUniversity/university.service';
import { UserSessionService } from 'libs/service/userSession/userSession.service';
import { ApplicationDataService } from 'libs/service/applicatinData/applicationData.service';


interface contactInfo {
  contactID: Number;
  employeeName: string;
  email: string;
  designation: string;
  contact: string;
  whatsapp: string;
}

@Component({
  selector: 'app-university-detail',
  templateUrl: './university-detail.component.html',
  styleUrls: ['./university-detail.component.scss'],
  providers: [Location] // Provide the Location service
})
export class UniversityDetailComponent {

  @Input() university: any;
  @Output() goBack = new EventEmitter<void>();

  searchQuery: string = '';
  filteredPrograms: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 9;
  totalPages: number = 0;
  contactInfo: any[] = [];

  constructor(private location: Location,
    private universityService: UniversityService,
    private addprogramService: addprogramService,
    private userSessionService: UserSessionService,
    private router: Router,
    private applicationDataService: ApplicationDataService
  ) {
  }


  ngOnInit() {
    window.scrollTo(0, 0);
    this.filterPrograms();
    this.getUniversityPerson();
  }

  filterPrograms() {
    console.log(this.university.campusID);
    this.addprogramService.getCampusProgram(this.university.campusID).subscribe(
      (response) => {
        console.log('campus program:', response);
        this.filteredPrograms = response;
        this.totalPages = Math.ceil(
          this.filteredPrograms.length / this.itemsPerPage
        );
        this.currentPage = 1;
      },
      (error) => {
        console.error('Error fetching campus programs:', error);
      }
    );
  }

  getUniversityPerson() {
    console.log(this.university.uniID);
    this.universityService.getUniversityPerson(this.university.uniID).subscribe(
      (response) => {
        console.log('contact information:', response);
        this.contactInfo = response;
      },
      (error) => {
        console.error('Error fetching contact info:', error);
      }
    );
  }

  getPaginatedPrograms(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredPrograms.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  onApplyThroughUs() {
    const data = {
      campusName: this.university.campusName,
      universityId: this.university.uniID
    };

    this.applicationDataService.setApplicationData(data);

    if (this.userSessionService.isLoggedIn()) {
      this.router.navigate(['/apply-through-us']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

  getMiddlePages(): number[] {
  if (this.totalPages <= 5) {
    const middlePages = [];
    for (let i = 2; i < this.totalPages; i++) {
      middlePages.push(i);
    }
    return middlePages;
  }

  const middlePages = [];
  const range = 3; 
  const start = Math.max(2, this.currentPage - range);
  const end = Math.min(this.totalPages - 1, this.currentPage + range);

  for (let i = start; i <= end; i++) {
    middlePages.push(i);
  }

  return middlePages;
}

shouldShowLeadingEllipsis(): boolean {
  return this.totalPages > 5 && this.currentPage - 1 > 2;
}

shouldShowTrailingEllipsis(): boolean {
  return this.totalPages > 5 && this.totalPages - this.currentPage > 2;
}


}