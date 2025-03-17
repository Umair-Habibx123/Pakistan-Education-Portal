import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ASAS-portal';

  
  constructor(private router: Router, private route: ActivatedRoute) { }

  isHidden(): boolean {
    return [ '/admin-dashboard'].includes(this.router.url);
  }


}