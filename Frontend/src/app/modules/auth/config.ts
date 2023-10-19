import { environment } from 'src/environments/environment';

export const protectedResource = {
  API: {
    endpoint: `${environment.adminApiUrl}`,
    scopes: {
      read: ['api://72e146a1-848c-4f7a-8daf-385dde536b8f/API.Read'],
      write: ['api://72e146a1-848c-4f7a-8daf-385dde536b8f/API.ReadWrite'],
    },
  },
};
