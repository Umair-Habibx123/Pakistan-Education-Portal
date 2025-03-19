import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Location } from '@angular/common';
import { colors } from 'libs/styles/colors';

@Component({
  selector: 'app-admin-university-detail',
  templateUrl: './admin-university-detail.component.html',
  styleUrls: ['./admin-university-detail.component.scss']
})
export class AdminUniversityDetailComponent {
  colors = colors;

  @Input() university: any;
  @Output() goBack = new EventEmitter<void>();

  searchQuery: string = '';
  filteredPrograms: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 9;
  totalPages: number = 0;

  constructor(private location: Location) { }

  ngOnInit() {
    this.filterPrograms();
  }

  filterPrograms() {
  
    this.filteredPrograms = this.university.programs.filter((program: any) =>
      program.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );

    this.totalPages = Math.ceil(this.filteredPrograms.length / this.itemsPerPage);

    this.currentPage = 1;
  }

  getPaginatedPrograms(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredPrograms.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
}