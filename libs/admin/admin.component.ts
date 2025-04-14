import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  isSidebarOpen = false;
  isLargeScreen = window.innerWidth >= 992;

  // Initialize with default value that will be overwritten in ngOnInit
  currentSection: string = 'dashboard';

  menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { id: 'registrations', label: 'Registrations', icon: 'NotebookTabs' },
    { id: 'sliders', label: 'Sliders', icon: 'Images' },
    { id: 'universities', label: 'Universities', icon: 'University' },
    // { id: 'aboutUs', label: 'About Us', icon: 'FileText' },
    { id: 'privacy', label: 'Privacy Policy', icon: 'CircleAlert' },
    { id: 'settings', label: 'Settings', icon: 'Settings' },
  ];

  constructor() {
    this.updateScreenSize();
  }

  ngOnInit() {
    // Load the saved section from local storage when component initializes
    const savedSection = localStorage.getItem('selectedSidebarTab');
    if (savedSection && this.menuItems.some(item => item.id === savedSection)) {
      this.currentSection = savedSection;
    }
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
    // Save the selected section to local storage
    localStorage.setItem('selectedSidebarTab', section);
    if (!this.isLargeScreen) this.isSidebarOpen = false;
  }

  getTitle(section: string): string {
    const titles: { [key: string]: string } = {
      dashboard: 'Dashboard',
      registrations: 'Registrations',
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