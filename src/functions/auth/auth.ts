import { lambdaPublic } from '@functions/utils/lambdaWrapper';
import { IsNotEmpty, IsString } from 'class-validator';
import { AuthUseCase } from 'src/core/domain/useCases/Auth';
import { DynamoUserRepository } from 'src/core/implementation/repositories/UserRepository';
import { BcryptPasswordService } from 'src/core/implementation/services/PasswordService';
import { JsonWebTokenService } from 'src/core/implementation/services/Token';

class LoginReqDTO {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
interface ILoginRes {
  accessToken: string;
  userID: string;
}

export const login = lambdaPublic<LoginReqDTO, ILoginRes>(LoginReqDTO, async (req) => {
  const userRepo = new DynamoUserRepository();
  const tokenService = new JsonWebTokenService();
  const passwordService = new BcryptPasswordService();
  const useCase = new AuthUseCase(userRepo, tokenService, passwordService);

  return await useCase.login(req.username, req.password);
});

export const register = lambdaPublic<LoginReqDTO, void>(LoginReqDTO, async (req) => {
  const userRepo = new DynamoUserRepository();
  const tokenService = new JsonWebTokenService();
  const passwordService = new BcryptPasswordService();
  const useCase = new AuthUseCase(userRepo, tokenService, passwordService);

  return await useCase.register(req.username, req.password);
});
