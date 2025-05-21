import { Component } from '@angular/core';
import { GetUserService } from 'libs/service/getUsers/getUser.service';
import { Location } from '@angular/common';
import { ResetPassService } from 'libs/service/ResetPassword/resetPass.service';
import { UserInfoService } from 'libs/service/userinfo/user-info.service';
import { AuthService } from 'libs/service/userSignUp/userAuth.service';




interface University {
  uniID: number;
  universityName: string;
  campusID: number;
  campusName: string;
}

interface User {
  userID: string;
  firstName: string;
  designation: string;
  email: string;
  mobile: string;
  university: University[] | null;
  campus: string;
  password: string;
}

@Component({
  selector: 'app-registrations',
  templateUrl: './registrations.component.html',
  styleUrls: ['./registrations.component.scss']
})
export class RegistrationsComponent {
  users: User[] = [];
  filteredUsers: User[] = [];
  errorMessage: string = '';
  isLoading: boolean = false;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  selectedUser: any = null;
  searchTerm: string = ''
  isModalLoading: boolean = false;
  modalError: string = ''; 

  userToDelete: User | null = null;
  isDeleting: boolean = false;

  
  userPersonalInfo: any = null;
  userEducationalInfo: any = null;

  isEditMode: boolean = false;
  currentEditingUser: User = {
    userID: '',
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
    private resetPassService: ResetPassService,
    private location: Location,
    private authService: AuthService,
    private userInfoService: UserInfoService,
  ) { }

  ngOnInit(): void {
    this.fetchUsers();
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
            return Array.isArray(roles) && roles.some((role: any) => role.roleID === 3);
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


viewUserDetails(user: User): void {
  this.isModalLoading = true;
  this.modalError = '';
  this.selectedUser = user;
  
  // Reset previous data
  this.userPersonalInfo = null;
  this.userEducationalInfo = null;

  // Fetch personal info
  this.userInfoService.getUserPersonalInfo(user.userID).subscribe({
    next: (personalInfo) => {
      // Take first item if array
      this.userPersonalInfo = Array.isArray(personalInfo) ? personalInfo[0] : personalInfo;
      
      // Fetch educational info after personal info is loaded
      this.userInfoService.getUserEducationalInfo(user.userID).subscribe({
        next: (educationalInfo) => {
          // Take first item if array
          this.userEducationalInfo = Array.isArray(educationalInfo) ? educationalInfo[0] : educationalInfo;
          this.isModalLoading = false;
          
          // Show the modal after all data is loaded
          const modalElement = document.getElementById('studentModal');
          if (modalElement) {
            const modal = new (window as any).bootstrap.Modal(modalElement);
            modal.show();
          }
        },
        error: (eduError) => {
          this.modalError = 'Failed to load educational information';
          this.isModalLoading = false;
          console.error('Error fetching educational info:', eduError);
        }
      });
    },
    error: (personalError) => {
      this.modalError = 'Failed to load personal information';
      this.isModalLoading = false;
      console.error('Error fetching personal info:', personalError);
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

  editUser(user: User): void {
    this.isEditMode = true;
    this.currentEditingUser = { ...user };
  }

    deleteUser(user: User): void {
    this.userToDelete = user;
    // Show the modal
    const modalElement = document.getElementById('deleteConfirmationModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }


  confirmDelete(): void {
    if (!this.userToDelete) return;

    this.isDeleting = true;



    const deleteData = {
      sptype: "delete",
      userID: this.userToDelete.userID,
      roleID: 2,
      firstName: '',
      designation: '',
      email: '',
      mobile: '',
      universityIDs: '[]',
      campus: '',
    };

    console.log("Delete data:", deleteData);

    this.authService.signup(deleteData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.fetchUsers(); // Refresh the user list
        this.errorMessage = '';
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to delete user. Please try again.';
        console.error('Error deleting user:', error);
      }
    });
  }




}
