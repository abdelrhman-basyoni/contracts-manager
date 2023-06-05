import { UserRepository } from '../repositories/UserRepository';
import { PasswordService } from '../services/PasswordService';
import { TokenService } from '../services/Token';
import { PermissionError, ValidationError } from '../utils/Errors';

export class AuthUseCase {
  constructor(
    readonly userRepo: UserRepository,
    readonly tokenService: TokenService,
    readonly passwordService: PasswordService,
  ) {}

  async login(username: string, password: string) {
    const candidateUser = await this.userRepo.findOneByUsernameWithPassword(username);

    if (!candidateUser) throw new PermissionError('Invalid login credentials');

    const correctPassword = await this.passwordService.comparePassword(
      password,
      String(candidateUser.password),
    );

    if (!correctPassword) {
      throw new PermissionError('Invalid login credentials');
    }

    const accessToken = this.tokenService.createAccessToken({
      id: candidateUser.username,
    });

    return { accessToken };
  }

  async register(username: string, password) {
    const exist = await this.userRepo.findOneByUsername(username);

    if (exist) {
      throw new ValidationError('User Already Exist');
    }
    const hashedPassword = await this.passwordService.hashPassword(password);

    await this.userRepo.registerUser(username, hashedPassword);

    return;
  }
}
