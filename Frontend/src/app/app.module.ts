import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { MessageService } from 'primeng/api';

import { AppComponent } from './app.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import {
  BrowserCacheLocation,
  IPublicClientApplication,
  PublicClientApplication,
  InteractionType,
} from '@azure/msal-browser';
import {
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG,
  MsalGuard,
  MsalGuardConfiguration,
  MsalInterceptor,
  MsalInterceptorConfiguration,
  MsalModule,
  MsalService,
  MsalRedirectComponent,
  ProtectedResourceScopes,
} from '@azure/msal-angular';
import { environment } from 'src/environments/environment';
import { protectedResource } from './modules/auth/config';

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: `${environment.msalConfig.clientId}`,
      authority: `${environment.msalConfig.authority}`,
      redirectUri: `${environment.msalConfig.redirectUri}`,
      postLogoutRedirectUri: `${environment.msalConfig.postLogoutRedirectUri}`,
      navigateToLoginRequestUrl: false,
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
    },
    system: {
      allowNativeBroker: false,
    },
  });
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<
    string,
    Array<string | ProtectedResourceScopes> | null
  >();
  protectedResourceMap.set(`${environment.msalConfig.graphEndpoint}`, [
    'user.read',
  ]);

  protectedResourceMap.set(protectedResource.API.endpoint, [
    {
      httpMethod: 'GET',
      scopes: [...protectedResource.API.scopes.read],
    },
    {
      httpMethod: 'POST',
      scopes: [...protectedResource.API.scopes.write],
    },
    {
      httpMethod: 'PUT',
      scopes: [...protectedResource.API.scopes.write],
    },
    {
      httpMethod: 'DELETE',
      scopes: [...protectedResource.API.scopes.write],
    },
  ]);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap,
  };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: ['user.read'],
    },
    
  };
}

@NgModule({
  declarations: [AppComponent, LoaderComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ToastModule,
    ProgressSpinnerModule,
    MsalModule,
  ],
  providers: [
    MessageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory,
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory,
    },
    MsalService,
    MsalGuard,
  ],
  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule {}
