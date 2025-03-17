import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomePageComponent } from 'libs/pages/home-page/home-page.component';
import { ProgramPageComponent } from 'libs/pages/program-page/program-page.component';
import { UniversitiesPageComponent } from 'libs/pages/universities-page/universities-page.component';
import { AboutUsPageComponent } from 'libs/pages/about-us-page/about-us-page.component';
import { ContactUSPageComponent } from 'libs/pages/contact-us-page/contact-us-page.component';
import { RegisterComponent } from 'libs/pages/register/register.component';
import { AdminComponent } from 'libs/admin/admin.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'programs', component: ProgramPageComponent },
  { path: 'universities', component: UniversitiesPageComponent },
  { path: 'aboutUs', component: AboutUsPageComponent },
  { path: 'contactUs', component: ContactUSPageComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin-dashboard', component: AdminComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
