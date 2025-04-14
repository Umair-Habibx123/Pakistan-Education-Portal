import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common';
import { addprogramService } from 'libs/service/addprogram/addProgram.service';

@Component({
  selector: 'app-admin-university-detail',
  templateUrl: './admin-university-detail.component.html',
  styleUrls: ['./admin-university-detail.component.scss'],
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
    duration: '123...',
    campusProgramID: 0,
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

  onEducationTypeChange(id: any): void {
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
        if (id !== 0) {
          this.newProgram.programID = id;
        } else {
          this.newProgram.programID = null;
        }
      },
      error: (err) => {
        console.error('Error fetching programs:', err);
        this.availablePrograms = [];
        alert('Failed to load programs for this degree level');
      },
    });
  }


  filterPrograms() {
    this.addprogramService.getCampusProgram(this.university.campusID).subscribe(
      (response) => {
        console.log('campus program:', response);

        // this.filteredPrograms = response.filter((program: any) => !program.is_Deleted);
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


    const selectedProgram = this.availablePrograms.filter(
      (x) => (x.programID = this.newProgram.programID)
    );

    console.log(selectedProgram);

    if (!selectedProgram) {
      alert('Invalid program selection');
      return;
    }
    let programData: any;
    if (this.newProgram.campusProgramID !== 0) {
      programData = {
        spType: 'update',
        uniID: this.university.uniID,
        eduationType: this.newProgram.degreeLevel,
        programID: selectedProgram[0].programID,
        programName: selectedProgram[0].programName,
        applicationFee: this.newProgram.fee,
        duration: this.newProgram.duration,
        campusID: this.university.campusID,
        userID: 1,
        tuitionFee: this.newProgram.fee,
        campusProgramID: this.newProgram.campusProgramID,
      };
    } else {
      programData = {
        spType: 'insert',
        uniID: this.university.uniID,
        eduationType: this.newProgram.degreeLevel,
        programID: selectedProgram[0].programID,
        programName: selectedProgram[0].programName,
        applicationFee: this.newProgram.fee,
        duration: this.newProgram.duration,
        campusID: this.university.campusID,
        userID: 1,
        tuitionFee: this.newProgram.fee,
      };
    }

    console.log('Adding new program:', programData);

    this.addprogramService.addprogram(programData).subscribe(
      (response) => {
        console.log('Program saved successfully:', response);
        alert('Program added successfully!');
        this.resetForm();
        this.filterPrograms();
      },
      (error) => {
        console.error('Error saving program:', error);
        alert('Failed to add program.');
      }
    );
  }

  // edit on click of campus program card edit icon
  editProgram(item: any) {
    this.newProgram.campusProgramID = item.campusProgramID;
    this.newProgram.degreeLevel = item.educationTypeID;
    this.newProgram.programID = item.programID; //added
    this.onEducationTypeChange(item.programID);
    // this.onEducationTypeChange(item.educationTypeID);
    this.newProgram.fee = item.tuitionFee;
    this.newProgram.duration = item.duration;

    console.log(this.newProgram);
  }

  deleteProgram(program: any): void {
    if (confirm('Are you sure you want to delete this program?')) {
      const deleteData = {
        spType: 'delete',
        campusProgramID: program.campusProgramID,
        userID: 1,
        tuitionFee: program.tuitionFee.toString(),
        duration: program.duration.toString(),
        programID: program.programID.toString(),
        educationType: program.educationTypeID.toString(),
        uniID: this.university.uniID.toString(), 
        campusID: this.university.campusID.toString() 
      };

      this.addprogramService.addprogram(deleteData).subscribe(
        (response) => {
          console.log('Program deleted successfully:', response);
          alert('Program deleted successfully!');
          this.filterPrograms();
        },
        (error) => {
          console.error('Error deleting program:', error);
          alert('Failed to delete program.');
        }
      );
    }
  }

  resetForm() {
    this.newProgram.degreeLevel = 0;
    this.newProgram.programID = null;
    this.newProgram.fee = null;
    this.newProgram.duration = '';
    this.newProgram.campusProgramID = 0;
  }
}
