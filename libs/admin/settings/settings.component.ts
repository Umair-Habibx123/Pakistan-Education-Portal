import { Component } from '@angular/core';
import { GetUserService } from 'libs/service/getUsers/getUser.service';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from 'libs/service/userSignUp/userAuth.service';
import { UserSessionService } from 'libs/service/userSession/userSession.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface User {
  userID: number;
  firstName: string;
  designation: string;
  email: string;
  mobile: string;
  university: string;
  campus: string;
  password: string;
  userRoles: string;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  users: User[] = [];
  currentUserDetails: User | null = null;
  errorMessage: string = '';
  isLoading: boolean = false;
  currentSessionUser: any = null;
  settingsForm: FormGroup;
  passwordUpdateMessage: string = '';
  passwordUpdateSuccess: boolean = false;

  constructor(
    private userService: GetUserService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private userSessionService: UserSessionService,
    private fb: FormBuilder
  ) {
    this.settingsForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.getCurrentSessionUser();
    this.fetchUsers();
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  getCurrentSessionUser(): void {
    this.currentSessionUser = this.userSessionService.getUser();
  }

  fetchUsers(): void {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (response) => {
        const allUsers = response.data || response;
        this.users = allUsers;
        console.log(response);

        if (this.currentSessionUser) {
          this.currentUserDetails = this.users.find(u => u.userID === this.currentSessionUser.userLoginId) || null;

          if (this.currentUserDetails) {
            let roles = [];
            try {
              roles = JSON.parse(this.currentUserDetails.userRoles);
            } catch (e) {
              console.error('Error parsing user roles', e);
            }

            this.settingsForm.patchValue({
              name: this.currentUserDetails.firstName,
              email: this.currentUserDetails.email
            });
          }
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load users. Please try again later.';
        console.error('Error fetching users:', error);
        this.isLoading = false;
      }
    });
  }

  dismissAlert(delay: number = 1500): void {
    setTimeout(() => {
      this.passwordUpdateMessage = '';
      this.passwordUpdateSuccess = false;
      this.cdr.detectChanges();
    }, delay);
  }

  onSubmit(): void {
    if (this.settingsForm.invalid) {
      return;
    }

    if (this.settingsForm.hasError('mismatch')) {
      this.passwordUpdateMessage = 'New password and confirm password do not match';
      this.passwordUpdateSuccess = false;
      this.dismissAlert();
      return;
    }

    const formData = {
      firstName: this.settingsForm.value.name,
      email: this.settingsForm.value.email,
      password: this.settingsForm.value.newPassword,
      spType: 'update',
      userId: this.currentSessionUser.userLoginId
    };

    this.isLoading = true;
    console.log("form data", formData);
    this.authService.signup(formData).subscribe({
      next: (response) => {
        this.passwordUpdateMessage = 'Password updated successfully!';
        this.passwordUpdateSuccess = true;
        this.settingsForm.get('currentPassword')?.reset();
        this.settingsForm.get('newPassword')?.reset();
        this.settingsForm.get('confirmPassword')?.reset();
        this.isLoading = false;
        this.dismissAlert();

        console.log(response);
      },
      error: (error) => {
        this.passwordUpdateMessage = 'Failed to update password. Please try again.';
        this.passwordUpdateSuccess = false;
        console.error('Error updating password:', error);
        this.isLoading = false;
        this.dismissAlert();

      }
    });
  }
}