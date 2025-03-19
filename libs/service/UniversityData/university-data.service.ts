import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UniversityDataService {
  getUniversities() {
    const universities = [
      {
        name: 'Bahauddin Zakariya University',
        image: 'assets/Uni1.png',
        logo: 'assets/Uni1-logo.png',
        location: 'Multan, Punjab',
        tuitionFee: '$18k - $19k',
        studyLevel: 'Bachelor’s',
        city: 'Multan',
        campuses: ['Multan', 'Lahore', 'Faisalabad'],
        programs: [
          {
            name: 'Computer Science',
            degreeLevel: 'MS',
            applicationFee: 'USD $200',
            duration: '24 months'
          },
        ],
        contactInfo: [
          {
            employeeName: 'Usman Rafique',
            designation: 'General Manager',
            email: 'gmusman453@gmail.com',
            contact: '+923040365071',
            whatsApp: '+923040365071'
          },
        ]
      },
      {
        name: 'COMSATS University',
        image: 'assets/Uni2.png',
        logo: 'assets/Uni2-logo.png',
        location: 'Islamabad, Punjab',
        tuitionFee: '$18k - $19k',
        studyLevel: 'Master’s',
        city: 'Islamabad',
        campuses: ['Islamabad', 'Vehari', 'Abbottabad'],
        programs: [
          {
            name: 'Business Administration',
            degreeLevel: 'MS',
            applicationFee: 'USD $200',
            duration: '24 months'
          },
        ]
      },
      {
        name: 'University of Punjab',
        image: 'assets/Uni3.png',
        logo: 'assets/Uni3-logo.png',
        location: 'Islamabad, Punjab',
        tuitionFee: '$18k - $19k',
        studyLevel: 'PhD',
        city: 'Islamabad',
        campuses: ['Lahore', 'Gujranwala', 'Multan'],
        programs: [
          {
            name: 'Business Administration',
            degreeLevel: 'MS',
            applicationFee: 'USD $200',
            duration: '24 months'
          },
        ]
      },
      {
        name: 'University of Central Punjab',
        image: 'assets/Uni4.png',
        logo: 'assets/Uni4-logo.png',
        location: 'Islamabad, Punjab',
        tuitionFee: '$18k - $19k',
        studyLevel: 'PhD',
        city: 'Islamabad',
        campuses: ['Lahore', 'Karachi', 'Islamabad'],
        programs: [
          {
            name: 'Business Administration',
            degreeLevel: 'MS',
            applicationFee: 'USD $200',
            duration: '24 months'
          },
        ]
      },
    ];

    // Add programsCount to each university
    return universities.map(university => ({
      ...university,
      programsCount: university.programs.length
    }));
  }
}