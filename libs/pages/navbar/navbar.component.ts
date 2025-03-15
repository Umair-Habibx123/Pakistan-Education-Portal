import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  isMenuOpen = false;
  lastScrollPosition = 0;
  isNavbarHidden = false;

  navLinks = [
    { path: '/', label: 'Home', exact: true },
    { path: '/programs', label: 'Programs' },
    { path: '/universities', label: 'Universities' },
    { path: '/aboutUs', label: 'About US' },
    { path: '/contactUs', label: 'Contact' },
  ];

  ngOnInit(): void {
    this.lastScrollPosition = window.pageYOffset;
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const currentScrollPosition = window.pageYOffset;

    if (currentScrollPosition > this.lastScrollPosition) {
      // Scrolling down: Hide navbar
      this.isNavbarHidden = true;
    } else {
      // Scrolling up: Show navbar
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
}
