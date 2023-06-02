import { lambdaPublic } from '@functions/utils/lambdaWrapper';

interface ILogin {
  username: string;
  password: string;
}

interface ILoginRes {
  token: string;
}

export const login = lambdaPublic<ILogin, ILoginRes>(async (req) => {
  return {
    token: `${req.username}`,
  };
});
