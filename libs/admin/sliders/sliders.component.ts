import { Component } from '@angular/core';


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


}
