import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomePageComponent } from 'libs/pages/home-page/home-page.component';
import { UniversitiesPageComponent } from 'libs/pages/universities-page/universities-page.component';
import { AboutUsPageComponent } from 'libs/pages/about-us-page/about-us-page.component';
import { ContactUSPageComponent } from 'libs/pages/contact-us-page/contact-us-page.component';
import { AdminComponent } from 'libs/admin/admin.component';
import { AuthComponent } from 'libs/pages/auth/auth.component';
import { AdminAuthComponent } from 'libs/admin/admin-auth/admin-auth.component';
import { SignupComponent } from 'libs/pages/auth/signup/signup.component';
import { AdminLoginComponent } from 'libs/admin/admin-auth/admin-login/admin-login.component';
import { AdminResetPasswordComponent } from 'libs/admin/admin-auth/admin-reset-password/admin-reset-password.component';
import { LoginComponent } from 'libs/pages/auth/login/login.component';
import { AdminUniversityDetailComponent } from 'libs/admin/universities/admin-university-detail/admin-university-detail.component';
import { ApplyThroughUSComponent } from 'libs/pages/home-page/apply-through-us/apply-through-us.component';
import { AdminForgotComponent } from 'libs/admin/admin-auth/admin-forgot/admin-forgot.component';
import { AdminEnterCodeComponent } from 'libs/admin/admin-auth/admin-enter-code/admin-enter-code.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'universities', component: UniversitiesPageComponent },
  { path: 'aboutUs', component: AboutUsPageComponent },
  { path: 'contactUs', component: ContactUSPageComponent },
  { path: 'apply-through-us', component: ApplyThroughUSComponent },
  { path: 'admin-dashboard', component: AdminComponent },
  { path: 'university-details/:id', component: AdminUniversityDetailComponent },
  {
    path: 'auth', component: AuthComponent, children: [
      { path: 'signup', component: SignupComponent },
      { path: 'login', component: LoginComponent },
      { path: 'forgotPassword', component: AdminForgotComponent },
      { path: 'resetPassword', component: AdminResetPasswordComponent },
      { path: 'enterCode', component: AdminEnterCodeComponent },
      { path: '', redirectTo: '/', pathMatch: 'full' },
    ]
  },
  {
    path: 'adminAuth', component: AdminAuthComponent, children: [
      { path: 'adminLogin', component: AdminLoginComponent },
      { path: 'adminForgotPassword', component: AdminForgotComponent },
      { path: 'adminResetPassword', component: AdminResetPasswordComponent },
      { path: 'adminEnterCode', component: AdminEnterCodeComponent },
      { path: '', redirectTo: '/', pathMatch: 'full' },
    ]
  },

  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  // imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
