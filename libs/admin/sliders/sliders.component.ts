import { Component } from '@angular/core';
import { colors } from 'libs/styles/colors';

@Component({
  selector: 'app-sliders',
  templateUrl: './sliders.component.html',
  styleUrls: ['./sliders.component.scss']
})
export class SlidersComponent {
  colors  = colors;

  slides = [
    { logo: '../../../assets/slider.png' },
    { logo: '../../../assets/slider.png' },
    { logo: '../../../assets/slider.png' },
    { logo: '../../../assets/slider.png' },
  ];

}
