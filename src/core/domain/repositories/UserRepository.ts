import { User } from '../entities/User';

export abstract class UserRepository {
  abstract findOneByUsername(username: string): Promise<User | null>;
}
