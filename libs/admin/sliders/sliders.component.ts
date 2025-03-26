// // import { Component } from '@angular/core';


// // @Component({
// //   selector: 'app-sliders',
// //   templateUrl: './sliders.component.html',
// //   styleUrls: ['./sliders.component.scss']
// // })
// // export class SlidersComponent {
  
// //   isModalOpen = false;

// //   slides = [
// //     { logo: '../../../assets/slider.png' },
// //     { logo: '../../../assets/slider.png' },
// //     { logo: '../../../assets/slider.png' },
// //     { logo: '../../../assets/slider.png' },
// //   ];


// }

import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-sliders',
  templateUrl: './sliders.component.html',
  styleUrls: ['./sliders.component.scss']
})
export class SlidersComponent {
  
  isModalOpen = false;

  slides = [
    { logo: '../../../assets/slider.png' },
    { logo: '../../../assets/slider.png' },
    { logo: '../../../assets/slider.png' },
    { logo: '../../../assets/slider.png' },
  ];

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  triggerFileUpload() {
    this.fileInput.nativeElement.click(); // Open file dialog
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log('Selected file:', file);
    }
  }
}
