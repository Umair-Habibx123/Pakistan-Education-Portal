import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Location } from '@angular/common'; // Import the Location service
import { addprogramService } from "libs/service/addprogram/addProgram.service"
import { UniversityService } from 'libs/service/addUniversity/university.service';


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
}