import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UniversityService } from 'libs/service/addUniversity/university.service';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-partner-universities',
  templateUrl: './partner-universities.component.html',
  styleUrls: ['./partner-universities.component.scss']
})
export class PartnerUniversitiesComponent implements OnInit {
  universities: any[] = [];
  public productUrl = environment.productUrl;

  isUniversityPage: boolean = false;

  constructor(
    private router: Router,
    private universityService: UniversityService,
  ) {
    this.isUniversityPage = this.router.url === '/universities';
  }

  ngOnInit(): void {
    this.loadUniversities();
  }

  loadUniversities(): void {
    this.universityService.getUniversity(0).subscribe(
      (response) => {
        this.universities = response.filter((university: any) => !university.isDeleted);
      },
      (error) => {
        console.error('Error fetching universities:', error);
      }

    );
    console.log("universities = ", this.universities);

  }
}