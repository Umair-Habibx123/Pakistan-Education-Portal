import { Component } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {

  filtersApplied: boolean = false;

  onFiltersApplied(applied: boolean) {
    this.filtersApplied = applied;
  }
}