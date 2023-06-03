import { pathHandler } from '@functions/utils/pathHandler';

export const login = {
  handler: `${pathHandler(__dirname)}/auth.login`,
  events: [
    {
      http: {
        method: 'post',
        path: 'login',
      },
    },
  ],
};

export const register = {
  handler: `${pathHandler(__dirname)}/auth.register`,
  events: [
    {
      http: {
        method: 'post',
        path: 'register',
      },
    },
  ],
};
