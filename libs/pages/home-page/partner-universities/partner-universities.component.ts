import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UniversityDataService } from '../../../service/UniversityData/university-data.service'; // Import the service

@Component({
  selector: 'app-partner-universities',
  templateUrl: './partner-universities.component.html',
  styleUrls: ['./partner-universities.component.scss']
})
export class PartnerUniversitiesComponent implements OnInit {
  universities: any[] = []; // Initialize as an empty array
  isUniversityPage: boolean = false;

  constructor(private router: Router, private universityDataService: UniversityDataService) {
    this.isUniversityPage = this.router.url === '/universities';
  }

  ngOnInit(): void {
    this.universities = this.universityDataService.getUniversities();
  }
}