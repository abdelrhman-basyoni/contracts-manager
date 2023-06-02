export abstract class PasswordService {
  abstract comparePassword(candidatePasswords: string, hashedPassword: string): Promise<boolean>;
}
