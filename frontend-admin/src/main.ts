import {
  enableProdMode,
  importProvidersFrom,
} from '@angular/core';

import {
  BrowserModule,
  bootstrapApplication,
} from '@angular/platform-browser';

import {
  provideHttpClient,
} from '@angular/common/http';

import {
  environment,
} from './environments/environment';

import {
  AppRoutingModule,
} from './app/app-routing.module';

import {
  AppComponent,
} from './app/app.component';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(
  AppComponent,
  {
    providers: [
      importProvidersFrom(
        BrowserModule,
        AppRoutingModule
      ),

      provideHttpClient(),
    ],
  }
).catch(
  (err) => console.error(err)
);