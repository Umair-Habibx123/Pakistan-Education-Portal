import { Component } from '@angular/core';


interface Users {
  name: string;
  email: string;
  contact: string;
  cities: string;
  university: string;
  image: string;
}


@Component({
  selector: 'app-registrations',
  templateUrl: './registrations.component.html',
  styleUrls: ['./registrations.component.scss']
})
export class RegistrationsComponent {
  users: Users[] = [
    { name: 'Senior UI/UX Designer', email: 'adn32@gmail.com', contact: '03000565431', cities: "Islamabad", university: "NUML", image: '../../../../assets/user.png' },
    { name: 'Senior UI/UX Designer', email: 'adn32@gmail.com', contact: '03000565431', cities: "Islamabad", university: "NUML", image: '../../../../assets/user.png' }
  ];

  
  searchTerm: string = '';
  filteredUsers = [...this.users];

  filterUsers() {
    this.filteredUsers = []; // Reset before filtering
    this.filteredUsers = this.users.filter(users =>
      users.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      users.cities.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      users.university.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
