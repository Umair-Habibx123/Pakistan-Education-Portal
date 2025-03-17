import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-form1',
  templateUrl: './form1.component.html',
  styleUrls: ['./form1.component.scss']
})
export class Form1Component {

  @Output() nextStep = new EventEmitter<void>();

  // declaration Form fields
  fullName: string = '';
  fatherName: string = '';
  cnic: string = '';
  phoneNumber: string = '';
  dateOfBirth: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  address: string = '';
  profilePicture: File | null = null;
  country: number | null = null;
  city: string = '';
  language: string = '';
  religion: string = '';
  filteredCities: string[] = [];



  // Dropdown options
  countries: any[] = [
    { countryId: 'Pakistan', countryName: 'Pakistan' },
    { countryId: 'India', countryName: 'India' },
    { countryId: 'USA', countryName: 'USA' }
  ];

  citiesData: any = [
    { Id: 'Pakistan', cities: ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi'] },
    { Id: 'India', cities: ['Delhi', 'Mumbai', 'Chennai', 'Bangalore'] },
    { Id: 'USA', cities: ['New York', 'Los Angeles', 'Chicago', 'Houston'] },
  ];


  onCountryChange() {
    this.city = '';
    const selectedCountry = this.citiesData.find((item: any) => item.Id === this.country);
    this.filteredCities = selectedCountry ? selectedCountry.cities : [];
  }



  languages: string[] = ['Urdu', 'English', 'Punjabi', 'Sindhi'];
  religions: string[] = ['Islam', 'Christianity', 'Hinduism'];


  // CNIC formatting
  formatCNIC() {
    let cnicValue = this.cnic.replace(/\D/g, ''); // Remove non-digits
    if (cnicValue.length > 5) {
      cnicValue = cnicValue.slice(0, 5) + '-' + cnicValue.slice(5);
    }
    if (cnicValue.length > 13) {
      cnicValue = cnicValue.slice(0, 13) + '-' + cnicValue.slice(13);
    }
    this.cnic = cnicValue.slice(0, 15); // Limit to 15 characters
  }

  // Phone number formatting
  formatPhoneNumber() {
    let phoneValue = this.phoneNumber.replace(/\D/g, ''); // Remove non-digits
    if (phoneValue.length > 3) {
      phoneValue = phoneValue.slice(0, 3) + '-' + phoneValue.slice(3);
    }
    this.phoneNumber = phoneValue.slice(0, 11); // Limit to 11 characters
  }



  // Form validation
  validateForm(): boolean {
    if (this.fullName.length < 3) {
      alert('Name must be greater than 3 characters');
      return false;
    }
    if (this.fatherName.length < 3) {
      alert('Father name must be greater than 3 characters');
      return false;
    }
    if (!/^[0-9]{5}-[0-9]{7}-[0-9]$/.test(this.cnic)) {
      alert('Invalid CNIC format.');
      return false;
    }
    if (!/^[0-9]{3}-[0-9]{7}$/.test(this.phoneNumber)) {
      alert('Invalid Phone Number format.');
      return false;
    }
    if (!this.dateOfBirth) {
      alert('Please enter your date of birth');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      alert('Invalid Email Address');
      return false;
    }
    if (this.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return false;
    }
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match');
      return false;
    }
    if (this.address.length < 1) {
      alert('Please enter address');
      return false;
    }
    if (!this.country) {
      alert('Please select a country');
      return false;
    }
    if (!this.city) {
      alert('Please select a city');
      return false;
    }
    if (!this.language) {
      alert('Please select a language');
      return false;
    }
    if (!this.religion) {
      alert('Please select a religion');
      return false;
    }
    return true;
  }



  goToNext() {
    // if (this.validateForm()) {
        // Log the form data to the console
    console.log({
      fullName: this.fullName,
      fatherName: this.fatherName,
      cnic: this.cnic,
      phoneNumber: this.phoneNumber,
      dateOfBirth: this.dateOfBirth,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword,
      address: this.address,
      profilePicture: this.profilePicture,
      country: this.country,
      city: this.city,
      language: this.language,
      religion: this.religion
    });
    this.nextStep.emit();
    // }
  }

}