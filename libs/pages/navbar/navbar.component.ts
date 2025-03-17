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
  scrollThreshold = 100; // Set the scroll threshold (in pixels)

  navLinks = [
    { path: '/', label: 'Home', exact: true },
    { path: '/programs', label: 'Programs' },
    { path: '/universities', label: 'Universities' },
    { path: '/aboutUs', label: 'About Us' },
    { path: '/contactUs', label: 'Contact' },
  ];

  ngOnInit(): void {
    this.lastScrollPosition = window.pageYOffset;
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const currentScrollPosition = window.pageYOffset;
  
    // Hide navbar when scrolled down by at least 75px
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
}