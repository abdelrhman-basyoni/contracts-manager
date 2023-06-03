import { User } from 'src/core/domain/entities/User';
import { UserRepository } from 'src/core/domain/repositories/UserRepository';
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';

export class DynamoUserRepository extends UserRepository {
  private usersTableName = 'UsersTable';
  constructor(readonly dynamoClient: DynamoDBClient) {
    super();
  }

  async findOneByUsername(username: string): Promise<User | null> {
    const cmd = new GetItemCommand({
      TableName: this.usersTableName,
      Key: {
        username: { S: username },
      },
    });

    const result = await this.dynamoClient.send(cmd);

    if (!result.Item) {
      return null;
    }
    const user = new User(result.Item.username.S, result.Item.password.S);

    return user;
  }
}
