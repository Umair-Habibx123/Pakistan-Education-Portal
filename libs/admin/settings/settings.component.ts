import { Component } from '@angular/core';
import { colors } from '../../styles/colors';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  colors = colors;

}
