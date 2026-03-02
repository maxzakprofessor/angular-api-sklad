import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
        routes, 
        withHashLocation(), // Matches Vue's createWebHashHistory
        withComponentInputBinding() // Pro tip: allows route params to be @Inputs
    ),
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
};
