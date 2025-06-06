import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingInterceptor } from 'libs/interceptor/loading.interceptor';
import { AuthInterceptor } from 'libs/interceptor/authInterceptor.interceptor';
import { LucideAngularModule, Bell, LayoutDashboard, Send, Settings, University, CircleAlert, FileText, Images, LogOut, MenuSquare, X, ChevronDown, ArrowLeft, ArrowRight, CalendarDays, NotebookTabs, UserRoundPlus, Sun, Moon, Monitor } from 'lucide-angular';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from '../../libs/admin/admin.component';
import { NavbarComponent } from '../../libs/pages/navbar/navbar.component';
import { HomePageComponent } from '../../libs/pages/home-page/home-page.component';
import { HeroSectionComponent } from '../../libs/pages/home-page/hero-section/hero-section.component';
import { PartnerUniversitiesComponent } from '../../libs/pages/home-page/partner-universities/partner-universities.component';
import { FooterComponent } from '../../libs/pages/footer/footer.component';
import { ContactUsComponent } from '../../libs/pages/home-page/contact-us/contact-us.component';
import { AboutUsComponent } from '../../libs/pages/home-page/about-us/about-us.component';
import { AboutUsPageComponent } from '../../libs/pages/about-us-page/about-us-page.component';
import { ContactUSPageComponent } from '../../libs/pages/contact-us-page/contact-us-page.component';
import { UniversitiesPageComponent } from '../../libs/pages/universities-page/universities-page.component';
import { AboutUs2Component } from '../../libs/pages/about-us-page/about-us2/about-us2.component';
import { Form1Component } from '../../libs/pages/home-page/apply-through-us/form1/form1.component';
import { Form2Component } from '../../libs/pages/home-page/apply-through-us/form2/form2.component';
import { DashboardComponent } from '../../libs/admin/dashboard/dashboard.component';
import { SlidersComponent } from '../../libs/admin/sliders/sliders.component';
import { UniversitiesComponent } from '../../libs/admin/universities/universities.component';
import { PrivacyComponent } from '../../libs/admin/privacy/privacy.component';
import { SettingsComponent } from '../../libs/admin/settings/settings.component';
import { AdminAboutUsComponent } from '../../libs/admin/admin-about-us/admin-about-us.component';

import { AuthComponent } from '../../libs/pages/auth/auth.component';
import { SignupComponent } from '../../libs/pages/auth/signup/signup.component';

import { AdminAuthComponent } from '../../libs/admin/admin-auth/admin-auth.component';
import { AdminLoginComponent } from '../../libs/admin/admin-auth/admin-login/admin-login.component';
import { AdminResetPasswordComponent } from '../../libs/admin/admin-auth/admin-reset-password/admin-reset-password.component';
import { LoginComponent } from '../../libs/pages/auth/login/login.component';
import { AdminUniversityDetailComponent } from '../../libs/admin/universities/admin-university-detail/admin-university-detail.component';
import { UniversityDetailComponent } from '../../libs/pages/home-page/hero-section/university-detail/university-detail.component';
import { ApplyThroughUSComponent } from '../../libs/pages/home-page/apply-through-us/apply-through-us.component';
import { RegistrationsComponent } from '../../libs/admin/registrations/registrations.component';
import { AdminForgotComponent } from '../../libs/admin/admin-auth/admin-forgot/admin-forgot.component';
import { AdminEnterCodeComponent } from '../../libs/admin/admin-auth/admin-enter-code/admin-enter-code.component';
import { UserManagementComponent } from '../../libs/admin/user-management/user-management.component';



@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    NavbarComponent,
    HomePageComponent,
    HeroSectionComponent,
    PartnerUniversitiesComponent,
    FooterComponent,
    ContactUsComponent,
    AboutUsComponent,
    AboutUsPageComponent,
    ContactUSPageComponent,
    UniversitiesPageComponent,
    AboutUs2Component,
    Form1Component,
    Form2Component,
    DashboardComponent,
    SlidersComponent,
    UniversitiesComponent,
    PrivacyComponent,
    SettingsComponent,
    AdminAboutUsComponent,
    SignupComponent,
    AuthComponent,
    AdminAuthComponent,
    AdminLoginComponent,
    AdminResetPasswordComponent,
    LoginComponent,
    AdminUniversityDetailComponent,
    UniversityDetailComponent,
    ApplyThroughUSComponent,
    RegistrationsComponent,
    AdminForgotComponent,
    AdminEnterCodeComponent,
    UserManagementComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    NgbModule,
    HttpClientModule, // Add this line
    LucideAngularModule.pick({ UserRoundPlus, ArrowLeft, ArrowRight, Bell, Send, LayoutDashboard, Images, LogOut, MenuSquare, X, ChevronDown, University, FileText, CircleAlert, Settings, CalendarDays, NotebookTabs, Sun, Moon, Monitor }),
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
