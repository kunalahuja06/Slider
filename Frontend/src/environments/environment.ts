export const environment = {
  production: true,
  apiUrl: 'https://slider-api.azurewebsites.net/api',
  adminApiUrl: 'https://slider-api.azurewebsites.net/api/admin',
  authUrl: 'https://slider-api.azurewebsites.net/auth',
  hubUrl: 'https://slider-api.azurewebsites.net/sliderhub',
  msalConfig: {
    clientId: '4c3b3e76-8dfe-44ac-a988-14d654e756c4',
    authority:
      'https://login.microsoftonline.com/865cc515-a530-4538-8ef8-072b7b2be759/',
    redirectUri: 'https://slider-app.azurewebsites.net/admin/home',
    postLogoutRedirectUri: 'https://slider-app.azurewebsites.net/auth/login',
    graphEndpoint: 'https://graph.microsoft.com/v1.0/me',
  },
};
