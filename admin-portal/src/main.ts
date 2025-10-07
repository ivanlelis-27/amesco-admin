import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { provideNativeDateAdapter } from '@angular/material/core';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    ...appConfig.providers || [],
    provideAnimations(),
    importProvidersFrom(HttpClientModule),
    provideNativeDateAdapter()
  ]
}).catch((err) => console.error(err));