import { ApplicationConfig, provideZoneChangeDetection, APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

// Note: APP_INITIALIZER is marked as deprecated but remains the only supported way
// to implement application initialization in current Angular versions.
// We should monitor Angular updates for official alternatives.
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { routes } from './app.routes';
import { AppInitializerService } from './services/app-initializer.service';
import { HttpInterceptorService } from './services/http-interceptor.service';
import { provideNzIcons } from './icons-provider';
import { provideNzI18n, zh_CN } from 'ng-zorro-antd/i18n';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';

registerLocaleData(zh);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideNzIcons(),
    provideNzI18n(zh_CN),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: (initializer: AppInitializerService) => () => initializer.initialize(),
      deps: [AppInitializerService],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
  ],
};
