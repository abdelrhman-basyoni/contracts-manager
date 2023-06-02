import { User } from '../entities/User';

export abstract class UserRepository {
  abstract findOneByUsername(email: string): Promise<User | null>;
}
