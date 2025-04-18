import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common';
import { addprogramService } from 'libs/service/addprogram/addProgram.service';
import { UserSessionService } from 'libs/service/userSession/userSession.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-admin-university-detail',
  templateUrl: './admin-university-detail.component.html',
  styleUrls: ['./admin-university-detail.component.scss'],
})
export class AdminUniversityDetailComponent implements OnInit {
  @Input() university: any;
  @Output() goBack = new EventEmitter<void>();

  searchTerm: string = '';
  private readonly FEE_REGEX = /^\d+(\.\d{1,2})?$/; // Allows numbers with optional 2 decimal places
  private readonly DURATION_REGEX = /^[1-9]\d*(\.\d{1,2})?$/; // Positive numbers with optional 2 decimal places

  filteredPrograms: any[] = [];
  errorMessage: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 2;
  totalPages: number = 0;
  educationType: any[] = [];
  availablePrograms: any[] = [];
  allPrograms: any[] = [];
  programToDelete: any = null;



  user = this.userSessionService.getUser();
  userId = this.user?.userLoginId;

  newProgram = {
    degreeLevel: 0,
    programID: null,
    fee: "",
    degreeFee: "",
    duration: '123...',
    campusProgramID: 0,
  };

  constructor(private addprogramService: addprogramService,
    private userSessionService: UserSessionService,
    private snackBar: MatSnackBar,
  ) { }

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
        this.snackBar.open('Failed to load programs for this degree level', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
        // alert('Failed to load programs for this degree level');
      },
    });
  }

  filterPrograms() {
    this.addprogramService.getCampusProgram(this.university.campusID).subscribe(
      (response) => {
        console.log('campus program:', response);
        this.filteredPrograms = response;
        this.allPrograms = [...response]; // Store original programs for filtering

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


  searchCampus(): void {
    if (!this.searchTerm) {
      this.filteredPrograms = [...this.allPrograms]; // Reset to original list
      this.currentPage = 1;
      this.totalPages = Math.ceil(this.filteredPrograms.length / this.itemsPerPage);
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredPrograms = this.allPrograms.filter(program =>
      (program.programName && program.programName.toLowerCase().includes(term)) ||
      (program.educationTypeTitle && program.educationTypeTitle.toLowerCase().includes(term)) ||
      (program.tuitionFee && program.tuitionFee.toString().includes(term)) ||
      (program.duration && program.duration.toString().includes(term))
    );

    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredPrograms.length / this.itemsPerPage);
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

    // Application Fee validation
    if (!this.newProgram.fee || !this.FEE_REGEX.test(this.newProgram.fee)) {
      this.errorMessage = 'Please enter a valid application fee';
      return;
    }

    // Degree Fee validation
    if (!this.newProgram.degreeFee || !this.FEE_REGEX.test(this.newProgram.degreeFee)) {
      this.errorMessage = 'Please enter a valid degree fee';
      return;
    }

    // Duration validation
    if (!this.newProgram.duration || !this.DURATION_REGEX.test(this.newProgram.duration)) {
      this.errorMessage = 'Please enter a valid duration (1 or higher)';
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
        degreeFee: this.newProgram.degreeFee,
        duration: this.newProgram.duration,
        campusID: this.university.campusID,
        userID: this.userId,
        tuitionFee: this.newProgram.fee.toString(),
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
        degreeFee: this.newProgram.degreeFee,
        duration: this.newProgram.duration,
        campusID: this.university.campusID,
        userID: this.userId,
        tuitionFee: this.newProgram.fee,
      };
    }

    console.log('Adding new program:', programData);

    this.addprogramService.addprogram(programData).subscribe(
      (response) => {
        document.getElementById('modalClose')?.click();
        console.log('Program saved successfully:', response);
        this.snackBar.open('Program added successfully!', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
        this.resetForm();
        this.filterPrograms();
      },
      (error) => {
        console.error('Error saving program:', error);
        this.snackBar.open('Failed to add program.', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      }
    );
  }

  // edit on click of campus program card edit icon
  editProgram(item: any) {
    this.newProgram.campusProgramID = item.campusProgramID;
    this.newProgram.degreeLevel = item.educationTypeID;
    this.newProgram.programID = item.programID;
    this.onEducationTypeChange(item.programID);
    this.newProgram.fee = item.tuitionFee;
    this.newProgram.degreeFee = item.degreeFee;
    this.newProgram.duration = item.duration;

    console.log(this.newProgram);
  }

  confirmDelete(program: any): void {
    this.programToDelete = program;
  }

  deleteProgram(): void {
    if (!this.programToDelete) return;

    const deleteData = {
      spType: 'delete',
      campusProgramID: this.programToDelete.campusProgramID,
      userID: this.userId,
      tuitionFee: this.programToDelete.tuitionFee.toString(),
      duration: this.programToDelete.duration.toString(),
      programID: this.programToDelete.programID.toString(),
      educationType: this.programToDelete.educationTypeID.toString(),
      uniID: this.university.uniID.toString(),
      campusID: this.university.campusID.toString()
    };

    this.addprogramService.addprogram(deleteData).subscribe(
      (response) => {
        console.log('Program deleted successfully:', response);
        this.snackBar.open('Program deleted successfully!', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
        // alert('Program deleted successfully!');
        this.filterPrograms();
      },
      (error) => {
        console.error('Error deleting program:', error);
        this.snackBar.open('Failed to delete program.', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
        // alert('Failed to delete program.');
      }
    );
  }

  resetForm() {
    this.newProgram.degreeLevel = 0;
    this.newProgram.programID = null;
    this.newProgram.fee = "";
    this.newProgram.duration = '';
    this.newProgram.degreeFee = "";
    this.newProgram.campusProgramID = 0;
  }
}
