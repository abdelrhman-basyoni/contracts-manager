import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  ScanCommand,
} from '@aws-sdk/client-dynamodb';
import { Contract } from 'src/core/domain/entities/Contract';
import { ContractRepository, IContractsIDs } from 'src/core/domain/repositories/ContractRepository';
import { uuidGenerator } from 'src/core/domain/utils/uuid';
import { dynamoClient } from 'src/core/implementation/repositories/dynamoDbClient';

export class DynamoContractRepository extends ContractRepository {
  private readonly contractTableName = 'ContractsTable';
  readonly dynamodbClient: DynamoDBClient;

  constructor() {
    super();
    this.dynamodbClient = dynamoClient();
  }

  async createContract(userID: string, contractName: string, templateID: string): Promise<string> {
    const contractID = uuidGenerator();

    const cmd = new PutItemCommand({
      TableName: this.contractTableName,
      Item: {
        contractID: { S: contractID },
        userID: { S: userID },
        contractName: { S: contractName },
        templateID: { S: templateID },
      },
    });

    await this.dynamodbClient.send(cmd);

    return contractID;
  }

  async getContractsIDs() {
    const cmd = new ScanCommand({
      TableName: this.contractTableName,
    });

    const result = await this.dynamodbClient.send(cmd);

    const contracts = result.Items;
    const ContractsIDs: IContractsIDs[] = contracts.map((contract) => ({
      contractID: contract.contractID.S,
    }));

    return ContractsIDs;
  }

  async getContractById(contractID: string): Promise<Contract | null> {
    const cmd = new GetItemCommand({
      TableName: this.contractTableName,
      Key: {
        contractID: { S: contractID },
      },
    });

    const result = await this.dynamodbClient.send(cmd);
    if (!result.Item) {
      return null;
    }

    const contract = new Contract(
      result.Item.cotractID.S,
      result.Item.userID.S,
      result.Item.contractName.S,
      result.Item.templateID.S,
    );

    return contract;
  }
}
