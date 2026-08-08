import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { Services } from './pages/services/services';
import { Contact } from './pages/contact/contact';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { ClientDashboard } from './pages/client-dashboard/client-dashboard';
import { NewDemande } from './pages/new-demande/new-demande';
import { MesDemandes } from './pages/mes-demandes/mes-demandes';
import { NotFoundComponent } from './pages/not-found/not-found';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'about',
    component: About,
  },
  {
    path: 'services',
    component: Services,
  },
  {
    path: 'contact',
    component: Contact,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },

  {
    path: 'client/dashboard',
    component: ClientDashboard,
  },

  {
    path: 'client/mes-demandes',
    component: MesDemandes,
  },

  {
    path: 'client/nouvelle-demande',
    component: NewDemande,
  },

  {
    path: '**',
    component: NotFoundComponent,
  },
];