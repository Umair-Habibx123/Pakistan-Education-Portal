import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  title = 'ASAS-portal';

  
  constructor(private router: Router, private route: ActivatedRoute) { }


  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
  }

  isHidden(): boolean {
    return ['/adminAuth/adminEnterCode','/adminAuth/adminForgotPassword' ,'/admin-dashboard', '/auth/signup' , '/adminAuth/adminLogin' , '/adminAuth/adminResetPassword','/auth/login' ].includes(this.router.url);
  }
}