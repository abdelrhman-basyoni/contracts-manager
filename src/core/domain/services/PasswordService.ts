export abstract class PasswordService {
  abstract comparePassword(candidatePasswords: string, hashedPassword: string): Promise<boolean>;
  abstract hashPassword(password: string): Promise<string>;
}
