import { pathHandler } from '@functions/utils/pathHandler';

export default {
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
