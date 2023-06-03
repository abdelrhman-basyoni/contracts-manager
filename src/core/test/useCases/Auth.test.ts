import { User } from 'src/core/domain/entities/User';
import { UserRepository } from 'src/core/domain/repositories/UserRepository';
import { PasswordService } from 'src/core/domain/services/PasswordService';
import { AuthUseCase } from 'src/core/domain/useCases/Auth';
import { DynamoUserRepository } from 'src/core/implementation/repositories/UserRepository';
import { BcryptPasswordService } from 'src/core/implementation/services/PasswordService';
import { JsonWebTokenService } from 'src/core/implementation/services/Token';
import { mock, instance, when } from 'ts-mockito';

describe('login useCase', () => {
  let userRepo: UserRepository;
  let useCase: AuthUseCase;
  const passwordService: PasswordService = new BcryptPasswordService();
  const tokenService = new JsonWebTokenService();
  beforeEach(() => {
    userRepo = mock<DynamoUserRepository>();

    useCase = new AuthUseCase(instance(userRepo), tokenService, passwordService);
  });

  it('should return accessToken token as a result of successful login', async () => {
    const username = 'username';
    const password = 'password';
    const hashedPassword = await passwordService.hashPassword(password);
    const user = new User('userId', username, hashedPassword);
    when(userRepo.findOneByUsernameWithPassword(username)).thenResolve(user);

    expect(useCase.login(username, password)).resolves.toHaveProperty('accessToken');
  });

  it('should throw error invalid login  when given a wrong password', async () => {
    const username = 'username';
    const password = 'password';
    const hashedPassword = await passwordService.hashPassword(password);
    const user = new User('userId', username, hashedPassword);

    when(userRepo.findOneByUsernameWithPassword(username)).thenResolve(user);
    expect(useCase.login(username, 'wrong password')).rejects.toThrow();
  });

  it('should throw error invalid login  when given a wrong username', async () => {
    const username = 'username';
    const password = 'password';
    when(userRepo.findOneByUsernameWithPassword(username)).thenResolve(null);

    expect(useCase.login(username, password)).rejects.toThrow();
  });
});

describe('register useCase', () => {
  let userRepo: UserRepository;
  let useCase: AuthUseCase;
  const passwordService: PasswordService = new BcryptPasswordService();
  const tokenService = new JsonWebTokenService();

  beforeEach(() => {
    userRepo = mock<DynamoUserRepository>();
    useCase = new AuthUseCase(instance(userRepo), tokenService, passwordService);
  });

  it('should successfully register a new user', async () => {
    const username = 'newUser';
    const password = 'newPassword';
    when(userRepo.findOneByUsername(username)).thenResolve(null);

    when(userRepo.registerUser(username, 'hashedPassword')).thenResolve();

    await expect(useCase.register(username, password)).resolves.not.toThrow();
  });

  it('should throw an error when trying to register an existing user', async () => {
    const username = 'existingUser';
    const password = 'newPassword';
    const existingUser = new User('userId', username);
    when(userRepo.findOneByUsername(username)).thenResolve(existingUser);

    await expect(useCase.register(username, password)).rejects.toThrow();
  });
});
