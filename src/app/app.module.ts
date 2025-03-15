import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from '../../libs/admin/admin.component';
import { UserComponent } from '../../libs/user/user.component';
import { NavbarComponent } from '../../libs/pages/navbar/navbar.component';
import { HomePageComponent } from '../../libs/pages/home-page/home-page.component';
import { ProgramPageComponent } from '../../libs/pages/program-page/program-page.component';
import { HeroSectionComponent } from '../../libs/pages/home-page/hero-section/hero-section.component';
import { PartnerUniversitiesComponent } from '../../libs/pages/home-page/partner-universities/partner-universities.component';
import { FooterComponent } from '../../libs/pages/footer/footer.component';
import { ContactUsComponent } from '../../libs/pages/home-page/contact-us/contact-us.component';
import { AboutUsComponent } from '../../libs/pages/home-page/about-us/about-us.component';
import { AboutUsPageComponent } from '../../libs/pages/about-us-page/about-us-page.component';
import { ContactUSPageComponent } from '../../libs/pages/contact-us-page/contact-us-page.component';
import { UniversitiesPageComponent } from '../../libs/pages/universities-page/universities-page.component';
import { AboutUs2Component } from '../../libs/pages/about-us-page/about-us2/about-us2.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    UserComponent,
    NavbarComponent,
    HomePageComponent,
    ProgramPageComponent,
    HeroSectionComponent,
    PartnerUniversitiesComponent,
    FooterComponent,
    ContactUsComponent,
    AboutUsComponent,
    AboutUsPageComponent,
    ContactUSPageComponent,
    UniversitiesPageComponent,
    AboutUs2Component,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
