import { Component, OnInit } from '@angular/core';
import { GetUserService } from 'libs/service/getUsers/getUser.service';
import { AuthService } from 'libs/service/userSignUp/userAuth.service';
import { UniversityService } from 'libs/service/addUniversity/university.service';
import { Location } from '@angular/common';

interface University {
  uniID: number;
  universityName: string;
  campusID: number;
  campusName: string;
}

interface User {
  firstName: string;
  designation: string;
  email: string;
  mobile: string;
  university: University[] | null;
  campus: string;
  password: string;
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  errorMessage: string = '';
  isLoading: boolean = false;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  selectedUser: any = null;
  universities: any[] = [];
  selectedUniversityIds: number[] = [];

  selectedUniversityId: number | null = null;
  campuses: any[] = [];
  selectedCampus: string = '';
  assignedUniversities: any[] = []; // To track multiple university assignments


  isEditMode: boolean = false;
  currentEditingUser: User = {
    firstName: '',
    designation: '',
    email: '',
    mobile: '',
    university: [],
    campus: '',
    password: ''
  };

  constructor(
    private userService: GetUserService,
    private authService: AuthService,
    private UniversityService: UniversityService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.fetchUsers();
    this.loadUniversities();

  }


  loadUniversities() {
    this.UniversityService.getUniversity(0).subscribe(
      (response) => {
        this.universities = response.filter((universities: any) => !universities.isDeleted);
        console.log(response);
      },
      (error) => {
        console.error('Error loading universities:', error);
      }
    );
  }

  getSelectedUniversityNames(): string {
    return this.selectedUniversityIds
      .map(id => {
        const uni = this.universities.find(u => u.uniID === id);
        return uni ? uni.universityName : '';
      })
      .filter(name => name !== '')
      .join(', ');
  }

  isUniversitySelected(uniID: number): boolean {
    return this.selectedUniversityIds.includes(uniID);
  }

  onUniversityChange(event: any, university: any) {
    if (event.target.checked) {
      if (!this.selectedUniversityIds.includes(university.uniID)) {
        this.selectedUniversityIds.push(university.uniID);
      }
    } else {
      this.selectedUniversityIds = this.selectedUniversityIds.filter(
        id => id !== university.uniID
      );
    }


    if (this.currentEditingUser) {
      this.currentEditingUser.university = this.selectedUniversityIds.map(id => {
        const uni = this.universities.find(u => u.uniID === id);
        return uni ? uni.universityName : '';
      });
    }
  }

  setSelectedUniversities(uniIdsString: string) {
    this.selectedUniversityIds = uniIdsString
      ? uniIdsString.split(',').map(id => parseInt(id.trim()))
      : [];
  }


  fetchUsers(): void {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (response) => {
        const allUsers = response.data || response;
        console.log(allUsers);

        this.users = allUsers.filter((user: any) => {
          if (user.userRoles && typeof user.userRoles === 'string') {
            try {
              const roles = JSON.parse(user.userRoles);
              return Array.isArray(roles) && roles.some((role: any) => role.roleID === 2);
            } catch (e) {
              console.error('Error parsing userRoles:', e);
              return false;
            }
          }
          return false;
        }).map((user: any) => {
          // Parse university data if it exists
          let universities: University[] = [];
          if (user.university && typeof user.university === 'string') {
            try {
              universities = JSON.parse(user.university);
            } catch (e) {
              console.error('Error parsing university data:', e);
            }
          }

          // Get unique university names
          const uniqueUnis = [...new Set(universities.map(u => u.universityName))];

          // Get all campus names grouped by university
          const campusesByUni = uniqueUnis.map(uni => {
            const campuses = universities
              .filter(u => u.universityName === uni)
              .map(u => u.campusName);
            return campuses.join(', ');
          });

          return {
            ...user,
            university: uniqueUnis,
            campus: campusesByUni.join('; ') // Separate different university campuses with semicolon
          };
        });

        this.filteredUsers = [...this.users];
        this.isLoading = false;
        console.log('Filtered users (roleId=3):', this.users);
      },
      error: (error) => {
        this.errorMessage = 'Failed to load users. Please try again later.';
        console.error('Error fetching users:', error);
        this.isLoading = false;
      }
    });
  }



  onSearch(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    if (!searchTerm) {
      this.filteredUsers = [...this.users];
      return;
    }

    const term = searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user => {
      return (user.firstName?.toLowerCase() ?? '').includes(term) ||
        (user.email?.toLowerCase() ?? '').includes(term) ||
        (user.designation?.toLowerCase() ?? '').includes(term) ||
        (user.mobile?.toString() ?? '').includes(term) ||
        (user.university?.some(uni => uni.universityName.toLowerCase().includes(term)) ?? false) ||
        (user.campus?.toLowerCase() ?? '').includes(term);
    });
  }


  editUser(user: User): void {
    this.isEditMode = true;
    this.currentEditingUser = { ...user };
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  get paginatedUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, startIndex + this.itemsPerPage);
  }


  goBack(): void {
    this.location.back();
  }


  viewUserDetails(user: any) {
    try {
      this.selectedUser = {
        ...user,
        universityData: user.university ? JSON.parse(user.university) : []
      };
    } catch (e) {
      this.selectedUser = {
        ...user,
        universityData: []
      };
    }
  }

  resetForm(): void {
    this.isEditMode = false;
    this.currentEditingUser.firstName = "";
    this.currentEditingUser.email = "";
    this.currentEditingUser.campus = "";
    this.currentEditingUser.designation = "";
    this.currentEditingUser.mobile = "";
    this.currentEditingUser.university = [];

  }


  onUniversitySelect(event: any): void {
    this.selectedUniversityId = Number(event.target.value);
    this.selectedCampus = '';
    this.loadCampuses(this.selectedUniversityId);
  }

  loadCampuses(universityId: number): void {
    this.UniversityService.getUniversity(universityId).subscribe(
      (response) => {
        this.campuses = response.filter((uni: any) => uni.uniID === universityId);
      },
      (error) => {
        console.error('Error loading campuses:', error);
      }
    );
  }


  addUniversityAssignment(): void {
    if (!this.selectedUniversityId || !this.selectedCampus) {
      this.errorMessage = 'Please select both university and campus';
      return;
    }

    const selectedUni = this.universities.find(u => u.uniID === this.selectedUniversityId);

    this.assignedUniversities.push({
      uniID: this.selectedUniversityId,
      universityName: selectedUni?.universityName || '',
      campusName: this.selectedCampus
    });

    // Reset selection for next assignment
    this.selectedUniversityId = null;
    this.selectedCampus = '';
    this.campuses = [];
  }


  removeUniversityAssignment(index: number): void {
    this.assignedUniversities.splice(index, 1);
  }

  // addUser(): void {
  
  //   this.isLoading = true;

  //   const registrationData = {
  //     sptype: "insert",
  //     roleID: 2,
  //     firstName: this.currentEditingUser.firstName,
  //     designation: this.currentEditingUser.designation,
  //     email: this.currentEditingUser.email,
  //     mobile: this.currentEditingUser.mobile,
  //     password: this.currentEditingUser.password,
  //     universityIDs: JSON.stringify(this.assignedUniversities),
  //     campus: '' // Now handled in university assignments
  //   };

  //   console.log("user data : ", registrationData)

  //   this.authService.signup(registrationData).subscribe({
  //     next: (response) => {
  //       this.isLoading = false;
  //       document.getElementById('closeModal')?.click();
  //       this.fetchUsers();
  //       this.resetForm();
  //     },
  //     error: (error) => {
  //       this.isLoading = false;
  //       this.errorMessage = 'Failed to add user. Please try again.';
  //       console.error('Error adding user:', error);
  //     }
  //   });
  // }

  addUser(): void {
  this.isLoading = true;

  // Format the university data correctly for the backend
  const universityData = this.assignedUniversities.map(uni => ({
    uniID: uni.uniID,
    campusID: uni.campusID // Make sure you're including campusID if needed
  }));

  const registrationData = {
    sptype: "insert",
    roleID: 2,
    firstName: this.currentEditingUser.firstName,
    designation: this.currentEditingUser.designation,
    email: this.currentEditingUser.email,
    mobile: this.currentEditingUser.mobile,
    password: this.currentEditingUser.password,
    universityIDs: JSON.stringify(universityData), // This will create the correct format
    campus: '' // Now handled in university assignments
  };

  console.log("user data : ", registrationData);

  this.authService.signup(registrationData).subscribe({
    next: (response) => {
      this.isLoading = false;
      document.getElementById('closeModal')?.click();
      this.fetchUsers();
      this.resetForm();
      this.assignedUniversities = []; // Clear assigned universities
    },
    error: (error) => {
      this.isLoading = false;
      this.errorMessage = 'Failed to add user. Please try again.';
      console.error('Error adding user:', error);
    }
  });
}

  updateUser(): void {
    // if (!this.validateUserForm()) {
    //   return;
    // }

    this.isLoading = true;

    const updateData = {
      userId: 0,
      firstName: this.currentEditingUser.firstName,
      designation: this.currentEditingUser.designation,
      email: this.currentEditingUser.email,
      mobile: this.currentEditingUser.mobile,
      university: this.selectedUniversityIds.join(','),
      campus: this.currentEditingUser.campus
    };

    console.log(updateData);
  }

  // private validateUserForm(): boolean {
  //   if (!this.currentEditingUser.firstName ||
  //     !this.currentEditingUser.email ||
  //     !this.currentEditingUser.mobile ||
  //     this.selectedUniversityIds.length === 0) {
  //     this.errorMessage = 'Please fill all required fields';
  //     return false;
  //   }

  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (!emailRegex.test(this.currentEditingUser.email)) {
  //     this.errorMessage = 'Please enter a valid email address';
  //     return false;
  //   }

  //   this.errorMessage = '';
  //   return true;
  // }
}


// fetchUsers(): void {
//   this.isLoading = true;
//   this.userService.getUsers().subscribe({
//     next: (response) => {
//       this.users = response.data || response;
//       this.filteredUsers = [...this.users];
//       this.isLoading = false;
//       console.log(response);
//     },
//     error: (error) => {
//       this.errorMessage = 'Failed to load users. Please try again later.';
//       console.error('Error fetching users:', error);
//       this.isLoading = false;
//     }
//   });
// }