import { Component, OnInit } from '@angular/core';
import { GetUserService } from 'libs/service/getUsers/getUser.service';
import { AuthService } from 'libs/service/userSignUp/userAuth.service';
import { Location } from '@angular/common';

interface User {
  firstName: string;
  designation: string;
  email: string;
  mobile: string;
  university: string;
  campus: string;
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

  constructor(
    private userService: GetUserService,
    private authService: AuthService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (response) => {
        this.users = response.data || response;
        this.filteredUsers = [...this.users];
        this.isLoading = false;
        console.log(response);
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
    this.filteredUsers = this.users.filter(user =>
      user.firstName.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.designation.toLowerCase().includes(term) ||
      user.mobile.includes(term) ||
      user.university.toLowerCase().includes(term) ||
      user.campus.toLowerCase().includes(term)
    );
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


  resetForm(): void {

  }

  addUser(): void {

  }

  viewUserDetails(user: User): void {
  }
}