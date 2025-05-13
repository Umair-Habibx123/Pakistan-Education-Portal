import { Component, HostListener, OnInit } from '@angular/core';
import { UserSessionService } from 'libs/service/userSession/userSession.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isMenuOpen = false;
  lastScrollPosition = 0;
  isNavbarHidden = false;
  scrollThreshold = 100;
  isDropdownOpen = false;

  navLinks = [
    { path: '/', label: 'Home', exact: true },
    { path: '/aboutUs', label: 'About Us' },
    { path: '/universities', label: 'Universities' },
    { path: '/contactUs', label: 'Contact' },
  ];

  constructor(
    public sessionService: UserSessionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.lastScrollPosition = window.pageYOffset;
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const currentScrollPosition = window.pageYOffset;

    if (currentScrollPosition > this.lastScrollPosition && currentScrollPosition > 75) {
      this.isNavbarHidden = true;
    }
    else if (currentScrollPosition < this.lastScrollPosition) {
      this.isNavbarHidden = false;
    }

    this.lastScrollPosition = currentScrollPosition;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  goToDashboard(): void {
    this.router.navigate(['/admin-dashboard']);
    this.closeDropdown();
  }

  logout(): void {
    this.sessionService.clearSession();
    this.isDropdownOpen = false;
    this.router.navigate(['/']);
    localStorage.clear();
    window.location.reload();
  }

  getInitials(name: string | undefined): string {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
  }
}