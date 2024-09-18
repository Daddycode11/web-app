import { Routes } from '@angular/router';
import { HomeComponent } from '../nav/home/home.component';
import { AboutComponent } from '../nav/about/about.component';
import { ContactsComponent } from '../nav/contacts/contacts.component';
import { AnnouncementComponent } from '../nav/announcement/announcement.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

import { RegisterComponent } from '../Auth/register/register.component';
import { ProductsComponent } from './products/products.component';
import { TouristSpotComponent } from './tourist-spot/tourist-spot.component';

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
      {
        path: 'products',
        component: ProductsComponent,
      },
      {
        path: 'tourist-spot',
        component: TouristSpotComponent,
      },
    ],
  },
];
