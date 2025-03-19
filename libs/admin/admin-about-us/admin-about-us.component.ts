import { Component } from '@angular/core';


@Component({
  selector: 'app-admin-about-us',
  templateUrl: './admin-about-us.component.html',
  styleUrls: ['./admin-about-us.component.scss']
})
export class AdminAboutUsComponent {
  

  aboutUs = [
    {
      image: '../../../assets/about1.jpeg',
      heading: "Country Name will go here..",
      description: "Slider description will go here..",
    },
    {
      image: '../../../assets/about2.jpeg',
      heading: "Country Name will go here..",
      description: "Slider description will go here..",
    },
    {
      image: '../../../assets/about3.jpeg',
      heading: "Country Name will go here..",
      description: "Slider description will go here..",
    },
  ];


  searchTerm: string = '';
  filteredAboutUs = [...this.aboutUs];

  filteredAboutus() {
    this.filteredAboutUs = []; // Reset before filtering
    this.filteredAboutUs = this.aboutUs.filter(aboutUs =>
      aboutUs.heading.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      aboutUs.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

}