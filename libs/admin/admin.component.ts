import { Component, HostListener } from '@angular/core';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  
  isSidebarOpen = true;
  isLargeScreen = window.innerWidth >= 992;

  currentSection: string = 'dashboard';

  menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { id: 'sliders', label: 'Sliders', icon: 'Images' },
    { id: 'universities', label: 'Universities', icon: 'University' },
    { id: 'aboutUs', label: 'About Us', icon: 'FileText' },
    { id: 'privacy', label: 'Privacy Policy', icon: 'CircleAlert' },
    { id: 'settings', label: 'Settings', icon: 'Settings' },
  ];

  constructor() {
    this.updateScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  updateScreenSize() {
    this.isLargeScreen = window.innerWidth >= 992;
    if (this.isLargeScreen) {
      this.isSidebarOpen = true; // Always open on large screens
    }
  }

  loadContent(section: string) {
    this.currentSection = section;
    if (!this.isLargeScreen) this.isSidebarOpen = false;
  }

  getTitle(section: string): string {
    const titles: { [key: string]: string } = {
      dashboard: 'Dashboard',
      sliders: 'Sliders',
      universities: 'Universities',
      aboutUs: 'About Us',
      privacy: 'Privacy Policy',
      settings: 'Settings',
    };
    return titles[section] || 'Dashboard';
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}