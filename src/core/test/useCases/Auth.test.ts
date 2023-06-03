import { User } from 'src/core/domain/entities/User';
import { UserRepository } from 'src/core/domain/repositories/UserRepository';
import { PasswordService } from 'src/core/domain/services/PasswordService';
import { AuthUseCase } from 'src/core/domain/useCases/Auth';
import { DynamoUserRepository } from 'src/core/implementation/repositories/UserRepository';
import { BcryptPasswordService } from 'src/core/implementation/services/PasswordService';
import { JsonWebTokenService } from 'src/core/implementation/services/Token';
import { mock, instance, when } from 'ts-mockito';

describe(' login useCase', () => {
  let userRepo: UserRepository;
  let useCase: AuthUseCase;
  let passwordService: PasswordService;

  beforeAll(async () => {
    userRepo = mock<DynamoUserRepository>();
    passwordService = new BcryptPasswordService();
    useCase = new AuthUseCase(instance(userRepo), new JsonWebTokenService(), passwordService);
    const username = 'username';
    const password = 'password';
    const hashedPassword = await passwordService.hashPassword(password);
    const user = new User(username, hashedPassword);
    when(userRepo.findOneByUsername(username))
      .thenResolve(user)
      .thenResolve(user)
      .thenResolve(null);
  });

  it('should return accessToken token as a result of successful login', async () => {
    const username = 'username';
    const password = 'password';

    expect(useCase.login(username, password)).resolves.toHaveProperty('accessToken');
  });

  it('should throw error invalid login  when given a wrong password', async () => {
    const username = 'username';

    expect(useCase.login(username, 'wrong password')).rejects.toThrow();
  });

  it('should throw error invalid login  when given a wrong username', async () => {
    const username = 'username';
    const password = 'password';

    expect(useCase.login(username, password)).rejects.toThrow();
  });
});
