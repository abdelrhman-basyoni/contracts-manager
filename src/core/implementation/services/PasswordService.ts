import { PasswordService } from '../../domain/services/PasswordService';
import * as bcrypt from 'bcryptjs';

export class BcryptPasswordService extends PasswordService {
  async comparePassword(candidatePassword: string, hashedPassword: string) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
}
