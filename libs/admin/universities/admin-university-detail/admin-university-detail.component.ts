import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common';
import { addprogramService } from 'libs/service/addprogram/addProgram.service';


@Component({
  selector: 'app-admin-university-detail',
  templateUrl: './admin-university-detail.component.html',
  styleUrls: ['./admin-university-detail.component.scss']
})
export class AdminUniversityDetailComponent implements OnInit {


  @Input() university: any;
  @Output() goBack = new EventEmitter<void>();

  searchQuery: string = '';
  filteredPrograms: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 9;
  totalPages: number = 0;
  educationType: any[] = [];
  availablePrograms: any[] = [];


  newProgram = {
    degreeLevel: 0,
    programID: null,
    fee: null,
    duration: "123..."
  };

  constructor(private addprogramService: addprogramService) { }


  ngOnInit() {
    this.filterPrograms();
    this.loadEducationType();
  }

  loadEducationType(): void {
    this.addprogramService.getEducationType().subscribe(
      (response) => {
        console.log('Education Types:', response); 
        this.educationType = response;
      },
      (error) => {
        console.error('Error fetching education types:', error);
      }
    );
  }


  onEducationTypeChange(): void {
    if (!this.newProgram.degreeLevel) {
      this.availablePrograms = [];
      return;
    }

    this.addprogramService.getPrograms(this.newProgram.degreeLevel).subscribe({
      next: (response) => {
        if (!response || response.length === 0) {
          console.warn('No programs available for this degree level');
        }
        this.availablePrograms = response;
        this.newProgram.programID = null;
      },
      error: (err) => {
        console.error('Error fetching programs:', err);
        this.availablePrograms = [];
        alert('Failed to load programs for this degree level');
      }
    });
  }

  filterPrograms() {

    this.filteredPrograms = this.university.programs.filter((program: any) =>
      program.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );

    this.totalPages = Math.ceil(this.filteredPrograms.length / this.itemsPerPage);

    this.currentPage = 1;
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


  addProgram(): void {
    if (!this.newProgram.programID) {
      alert('Please select a program');
      return;
    }

    
    const selectedProgram = this.availablePrograms.find(
      p => p.programID === this.newProgram.programID
    );

    if (!selectedProgram) {
      alert('Invalid program selection');
      return;
    }

    const programData = {
      spType: "insert",
      uniID: this.university.id, 
      eduationType: this.newProgram.degreeLevel,
      program: selectedProgram.programID, 
      programName: selectedProgram.programName, 
      applicationFee: this.newProgram.fee,
      duration: this.newProgram.duration,
      campusID: 1, 
      userID: 1, 
      tuitionFee: this.newProgram.fee,
    };

    console.log('Adding new program:', programData);

    this.addprogramService.addprogram(programData).subscribe(
      (response) => {
        console.log('Program saved successfully:', response);
        alert('Program added successfully!');
        this.resetForm();
        
      },
      (error) => {
        console.error('Error saving program:', error);
        alert('Failed to add program.');
      }
    );
  }

  resetForm() {
    this.newProgram.degreeLevel = 0;
    this.newProgram.programID = null;
    this.newProgram.fee = null;
  }
}
