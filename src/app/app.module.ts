import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms'; 
import { LucideAngularModule, Bell, LayoutDashboard, Settings,University, CircleAlert,FileText,Images, LogOut, Menu, X, ChevronDown } from 'lucide-angular';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from '../../libs/admin/admin.component';
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
import { RegisterComponent } from '../../libs/pages/register/register.component';
import { Form1Component } from '../../libs/pages/register/form1/form1.component';
import { Form2Component } from '../../libs/pages/register/form2/form2.component';
import { DashboardComponent } from '../../libs/admin/dashboard/dashboard.component';
import { SlidersComponent } from '../../libs/admin/sliders/sliders.component';
import { UniversitiesComponent } from '../../libs/admin/universities/universities.component';
import { PrivacyComponent } from '../../libs/admin/privacy/privacy.component';
import { SettingsComponent } from '../../libs/admin/settings/settings.component';
import { AdminAboutUsComponent } from '../../libs/admin/admin-about-us/admin-about-us.component';


@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
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
    RegisterComponent,
    Form1Component,
    Form2Component,
    DashboardComponent,
    SlidersComponent,
    UniversitiesComponent,
    PrivacyComponent,
    SettingsComponent,
    AdminAboutUsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    BrowserAnimationsModule, // angular Animation Module... 
    LucideAngularModule.pick({Bell, LayoutDashboard,Images, LogOut, Menu, X, ChevronDown,University,FileText, CircleAlert, Settings})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
