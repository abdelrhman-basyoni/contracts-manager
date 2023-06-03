import { User } from 'src/core/domain/entities/User';
import { UserRepository } from 'src/core/domain/repositories/UserRepository';
import { DynamoDBClient, PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import { dynamoClient } from 'src/core/implementation/repositories/dynamoDbClient';
import { uuidGenerator } from 'src/core/domain/utils/uuid';

export class DynamoUserRepository extends UserRepository {
  private usersTableName = 'UsersTable';
  readonly dynamodbClient: DynamoDBClient;

  constructor() {
    super();
    this.dynamodbClient = dynamoClient();
  }

  private async _findOneByUsername(username: string) {
    const cmd = new QueryCommand({
      TableName: this.usersTableName,
      IndexName: 'usernameIndex',
      KeyConditionExpression: 'username = :username',
      ExpressionAttributeValues: {
        ':username': { S: username },
      },
      Limit: 1,
    });

    return await this.dynamodbClient.send(cmd);
  }

  async findOneByUsername(username: string): Promise<User> {
    const result = await this._findOneByUsername(username);

    if (result.Items.length == 0) {
      return null;
    }

    const resultUser = result.Items[0];
    const user = new User(resultUser.id.S, resultUser.username.S);

    return user;
  }

  async findOneByUsernameWithPassword(username: string): Promise<User | null> {
    const result = await this._findOneByUsername(username);

    if (result.Items.length == 0) {
      return null;
    }

    const resultUser = result.Items[0];
    const user = new User(resultUser.id.S, resultUser.username.S, resultUser.password.S);

    return user;
  }

  async registerUser(username: string, hashedPassword: string) {
    const userId = uuidGenerator();

    const cmd = new PutItemCommand({
      TableName: this.usersTableName,
      Item: {
        id: { S: userId },
        username: { S: username },
        password: { S: hashedPassword },
      },
    });
    await this.dynamodbClient.send(cmd);
  }
}
