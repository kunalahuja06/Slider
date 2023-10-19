export const environment = {
  production: false,
  apiUrl: 'https://localhost:7097/api',
  adminApiUrl: 'https://localhost:7097/api/admin',
  authUrl: 'https://localhost:7097/auth',
  hubUrl: 'https://localhost:7097/sliderhub',
  msalConfig: {
    clientId: 'c9a8bd0b-96ec-4680-9929-b2e1ad1de316',
    authority:
      'https://login.microsoftonline.com/349f6e76-d018-4ebb-99c6-71070c5f529e/',
    redirectUri: 'http://localhost:4200/admin/home',
    postLogoutRedirectUri: 'http://localhost:4200/auth/login',
    graphEndpoint: 'https://graph.microsoft.com/v1.0/me',
  },
};
