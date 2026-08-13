import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { adminAuthGuard } from './guards/admin-auth.guard';

const appRoutes: Routes = [

  {
    path: '',
    component: AdminComponent,
    canActivate: [adminAuthGuard],

    children: [

      {
        path: '',
        redirectTo: 'default',
        pathMatch: 'full'
      },

      {
        path: 'default',
        loadComponent: () =>
          import('./demo/dashboard/default/default.component')
            .then(component => component.DefaultComponent)
      },

      {
        path: 'users',
        loadComponent: () =>
          import('./demo/admin-panel/users/users')
            .then(component => component.Users)
      },

      {
        path: 'clients',
        loadComponent: () =>
          import('./demo/admin-panel/clients/clients')
            .then(component => component.Clients)
      },

      {
        path: 'demandes',
        loadComponent: () =>
          import('./views/demandes/demandes.component')
            .then(component => component.DemandesComponent)
      },

      {
        path: 'powerbi',
        loadComponent: () =>
          import('./views/powerbi-report/powerbi-report.component')
            .then(component => component.PowerbiReportComponent)
      }

    ]
  },

  {
    path: '',
    component: GuestComponent,

    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./demo/pages/authentication/login/login.component')
            .then(component => component.LoginComponent)
      }
    ]
  },

  {
    path: '**',
    redirectTo: 'default'
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}