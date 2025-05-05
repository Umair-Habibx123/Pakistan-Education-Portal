import { Component } from '@angular/core';
import { GetUserService } from 'libs/service/getUsers/getUser.service';
import { Location } from '@angular/common';
import { ResetPassService } from 'libs/service/ResetPassword/resetPass.service';

interface User {
  firstName: string;
  designation: string;
  email: string;
  mobile: string;
  university: string;
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
  searchTerm: string = '';

  isEditMode: boolean = false;
  currentEditingUser: User = {
    firstName: '',
    designation: '',
    email: '',
    mobile: '',
    university: '',
    campus: '',
    password: ''
  };


  constructor(
    private userService: GetUserService,
    private resetPassService: ResetPassService,
    private location: Location
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
        });

        this.filteredUsers = [...this.users];
        this.isLoading = false;
        console.log('Filtered users (roleId=1):', this.users);
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
        (user.university?.toLowerCase() ?? '').includes(term) ||
        (user.campus?.toLowerCase() ?? '').includes(term);
    });
  }

  viewUserDetails(user: any) {
    this.selectedUser = user;
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
}
