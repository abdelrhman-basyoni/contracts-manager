import { User } from '../entities/User';

export abstract class UserRepository {
  abstract findOneByUsername(username: string): Promise<User | null>;
  abstract findOneByUsernameWithPassword(username: string): Promise<User | null>;
  abstract registerUser(username: string, hashedPassword: string): Promise<void>;
}
