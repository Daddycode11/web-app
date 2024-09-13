import { Routes } from '@angular/router';
import { HomeComponent } from '../nav/home/home.component';
import { AboutComponent } from '../nav/about/about.component';
import { ContactsComponent } from '../nav/contacts/contacts.component';
import { AnnouncementComponent } from '../nav/announcement/announcement.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from '../Auth/login/login.component';
import { RegisterComponent } from '../Auth/register/register.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/landing-page',
    pathMatch: 'full',
  },
  {
    path: 'landing-page',
    component: LandingPageComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'about',
        component: AboutComponent,
      },
      {
        path: 'contacts',
        component: ContactsComponent,
      },
      {
        path: 'announcement',
        component: AnnouncementComponent,
      },
    ],
  },
];
