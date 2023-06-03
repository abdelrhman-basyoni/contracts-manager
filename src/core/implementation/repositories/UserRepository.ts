import { User } from 'src/core/domain/entities/User';
import { UserRepository } from 'src/core/domain/repositories/UserRepository';
import { DynamoDBClient, GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { dynamoClient } from 'src/core/implementation/repositories/dynamoDbClient';

export class DynamoUserRepository extends UserRepository {
  private usersTableName = 'UsersTable';
  readonly dynamoClient: DynamoDBClient;

  constructor() {
    super();
    this.dynamoClient = dynamoClient();
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

  async registerUser(username: string, hashedPassword: string) {
    const cmd = new PutItemCommand({
      TableName: this.usersTableName,
      Item: {
        username: { S: username },
        password: { S: hashedPassword },
      },
    });
    await this.dynamoClient.send(cmd);
  }
}
