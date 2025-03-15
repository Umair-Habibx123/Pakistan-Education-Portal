import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-partner-universities',
  templateUrl: './partner-universities.component.html',
  styleUrls: ['./partner-universities.component.scss']
})
export class PartnerUniversitiesComponent {
  universities = [
    {
      name: 'Bahauddin Zakariya University',
      image: 'assets/Uni1.png',
      logo: 'assets/Uni1-logo.png',
      location: 'Multan, Punjab',
      programs: 36,
      tuitionFee: '$18k - $19k'
    },
    {
      name: 'COMSATS University',
      image: 'assets/Uni2.png',
      logo: 'assets/Uni2-logo.png',
      location: 'Multan, Punjab',
      programs: 36,
      tuitionFee: '$18k - $19k'
    },
    {
      name: 'University of Punjab',
      image: 'assets/Uni3.png',
      logo: 'assets/Uni3-logo.png',
      location: 'Multan, Punjab',
      programs: 36,
      tuitionFee: '$18k - $19k'
    },
    {
      name: 'University of Central Punjab',
      image: 'assets/Uni4.png',
      logo: 'assets/Uni4-logo.png',
      location: 'Multan, Punjab',
      programs: 36,
      tuitionFee: '$18k - $19k'
    },





    {
      name: 'COMSATS University',
      image: 'assets/Uni2.png',
      logo: 'assets/Uni2-logo.png',
      location: 'Multan, Punjab',
      programs: 36,
      tuitionFee: '$18k - $19k'
    },
    {
      name: 'Bahauddin Zakariya University',
      image: 'assets/Uni1.png',
      logo: 'assets/Uni1-logo.png',
      location: 'Multan, Punjab',
      programs: 36,
      tuitionFee: '$18k - $19k'
    },
    {
      name: 'University of Central Punjab',
      image: 'assets/Uni4.png',
      logo: 'assets/Uni4-logo.png',
      location: 'Multan, Punjab',
      programs: 36,
      tuitionFee: '$18k - $19k'
    },
    {
      name: 'University of Punjab',
      image: 'assets/Uni3.png',
      logo: 'assets/Uni3-logo.png',
      location: 'Multan, Punjab',
      programs: 36,
      tuitionFee: '$18k - $19k'
    },
  ];

  isUniversityPage: boolean = false;

  constructor(private router: Router) {
    this.isUniversityPage = this.router.url === '/universities';
  }
}
