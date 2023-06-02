import { UserRepository } from '../repositories/UserRepository';
import { PasswordService } from '../services/PasswordService';
import { TokenService } from '../services/Token';
import { PermissionError } from '../utils/Errors';

export class AuthUseCase {
  constructor(
    readonly userRepo: UserRepository,
    readonly tokenService: TokenService,
    readonly passwordService: PasswordService,
  ) {}

  async login(username: string, password: string) {
    const candidateUser = await this.userRepo.findOneByUsername(username);

    if (!candidateUser) throw new PermissionError('Invalid login credentials');

    if (!this.passwordService.comparePassword(password, String(candidateUser.password))) {
      throw new PermissionError('Invalid login credentials');
    }

    const accessToken = this.tokenService.createAccessToken({
      id: candidateUser.id,
    });

    return { accessToken };
  }
}