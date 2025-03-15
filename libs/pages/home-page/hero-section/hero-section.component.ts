import { Component } from '@angular/core';

@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss']
})
export class HeroSectionComponent {
  studyLevels: string[] = [
    'PhD',
    'Master’s',
    'Bachelor’s',
    'Diploma',
    'Certificate',
    'Associate Degree'
  ];

  subjects: string[] = [
    'Computer Science',
    'Software Engineering',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Business Administration',
    'Medicine',
    'Law',
    'Architecture',
    'Mathematics',
    'Physics'
  ];

  cities: string[] = [
    'Islamabad',
    'Lahore',
    'Karachi',
    'Peshawar',
    'Quetta',
    'Faisalabad',
    'Rawalpindi',
    'Multan',
    'Hyderabad',
    'Sialkot'
  ];
}
