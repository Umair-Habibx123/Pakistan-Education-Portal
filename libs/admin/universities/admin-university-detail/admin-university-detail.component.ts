import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  private readonly FEE_REGEX = /^\d+(\.\d{1,2})?$/;
  private readonly DURATION_REGEX = /^[1-9]\d*(\.\d{1,2})?$/;

  isEditing: boolean = false;
  isLoading: boolean = false;
  isDeleting: boolean = false;

  filteredPrograms: any[] = [];
  errorMessage: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 0;
  educationType: any[] = [];
  teachingModes: any[] = [];
  availablePrograms: any[] = [];
  allPrograms: any[] = [];
  programToDelete: any = null;

  user = this.userSessionService.getUser();
  userId = this.user?.userLoginId;

  newProgram = {
    degreeLevel: null,
    programID: null,
    fee: "",
    degreeFee: "",
    duration: '123...',
    campusProgramID: 0,
    teachingModeID: null,
  };

  constructor(private addprogramService: addprogramService,
    private userSessionService: UserSessionService,
    private snackBar: MatSnackBar,
  ) { }


  ngOnInit() {
    this.filterPrograms();
    this.loadEducationType();
    this.getTeachingMode();
  }

  getTeachingMode(): void {
    this.isLoading = true;
    this.addprogramService.getTeachingMode().subscribe(
      (response) => {
        this.isLoading = false;

        this.teachingModes = response;
      },
      (error) => {
        this.isLoading = false;

        console.error('Error fetching teaching Modes:', error);
      }
    );
  }


  loadEducationType(): void {
    this.isLoading = true;
    this.addprogramService.getEducationType().subscribe(
      (response) => {
        this.isLoading = false;

        this.educationType = response;
      },
      (error) => {
        this.isLoading = false;

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
          console.warn('No programs available for ', this.newProgram.degreeLevel, "response = ", response);
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
        this.snackBar.open('Failed to load programs', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }


  filterPrograms() {
    this.isLoading = true;

    this.addprogramService.getCampusProgram(this.university.campusID).subscribe(
      (response) => {
        this.isLoading = false;
        this.filteredPrograms = response;
        this.allPrograms = [...response];

        this.totalPages = Math.ceil(
          this.filteredPrograms.length / this.itemsPerPage
        );
        this.currentPage = 1;
      },
      (error) => {
        this.isLoading = false;
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

    this.isLoading = true;

    if (!this.newProgram.programID) {
      this.isLoading = false;

      alert('Please select a program');
      return;
    }

    if (!this.newProgram.fee || !this.FEE_REGEX.test(this.newProgram.fee)) {
      this.isLoading = false;

      this.errorMessage = 'Please enter a valid application fee';

      return;
    }

    if (!this.newProgram.degreeFee || !this.FEE_REGEX.test(this.newProgram.degreeFee)) {
      this.isLoading = false;

      this.errorMessage = 'Please enter a valid degree fee';
      return;
    }

    if (!this.newProgram.duration || !this.DURATION_REGEX.test(this.newProgram.duration)) {
      this.isLoading = false;

      this.errorMessage = 'Please enter a valid duration (1 or higher)';
      return;
    }


    const selectedProgram = this.availablePrograms.filter(
      (x) => (x.programID = this.newProgram.programID)
    );


    if (!selectedProgram) {
      alert('Invalid program selection');
      this.isLoading = false;

      return;
    }

    let programData: any;
    if (this.newProgram.campusProgramID !== 0) {
      programData = {
        spType: 'update',
        programID: selectedProgram[0].programID,
        degreeFee: this.newProgram.degreeFee,
        duration: this.newProgram.duration,
        campusID: this.university.campusID,
        userID: this.user.userId,
        tuitionFee: this.newProgram.fee.toString(),
        campusProgramID: this.newProgram.campusProgramID,
        TeachingModeID: Number(this.newProgram.teachingModeID),

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
        userID: this.user.userId,
        tuitionFee: this.newProgram.fee,
        TeachingModeID: Number(this.newProgram.teachingModeID),
      };
    }

    this.addprogramService.addprogram(programData).subscribe(
      (response) => {
        this.isLoading = false;
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
        this.isLoading = false;
        console.error('Error saving program:', error);
        this.snackBar.open('Failed to add program.', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      }
    );
  }

  editProgram(item: any) {
    this.isEditing = true;

    this.newProgram.campusProgramID = item.campusProgramID;
    this.newProgram.degreeLevel = item.educationTypeID;
    this.newProgram.programID = item.programID;
    this.onEducationTypeChange(item.programID);
    this.newProgram.fee = item.tuitionFee;
    this.newProgram.degreeFee = item.degreeFee;
    this.newProgram.duration = item.duration;
    this.newProgram.teachingModeID = item.teachingModeID;
    console.log(this.newProgram);
  }

  confirmDelete(program: any): void {
    this.programToDelete = program;
  }

  deleteProgram(): void {
    if (!this.programToDelete) return;
    this.isLoading = true;

    const deleteData = {
      spType: 'delete',
      campusProgramID: this.programToDelete.campusProgramID,
      userID: this.user.userId,
      tuitionFee: this.programToDelete.tuitionFee.toString(),
      duration: this.programToDelete.duration.toString(),
      programID: this.programToDelete.programID.toString(),
      educationType: this.programToDelete.educationTypeID.toString(),
      uniID: this.university.uniID.toString(),
      campusID: this.university.campusID.toString()
    };

    this.addprogramService.addprogram(deleteData).subscribe(
      (response) => {
        this.isLoading = false;

        console.log('Program deleted successfully:', response);
        this.snackBar.open('Program deleted successfully!', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
        this.filterPrograms();
      },
      (error) => {
        this.isLoading = false;

        console.error('Error deleting program:', error);
        this.snackBar.open('Failed to delete program.', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      }
    );
  }

  resetForm() {
    this.newProgram.degreeLevel = null;
    this.newProgram.programID = null;
    this.newProgram.fee = "";
    this.newProgram.duration = '';
    this.newProgram.degreeFee = "";
    this.newProgram.campusProgramID = 0;
    this.newProgram.teachingModeID = null;
  }
}
