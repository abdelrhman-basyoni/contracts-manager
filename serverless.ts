import type { AWS } from '@serverless/typescript';
import { login, register } from '@functions/auth/functionsDefinitions';
import {
  getContract,
  getContractsIDs,
  createContract,
} from '@functions/contracts/functionsDefinitions';
import * as dotenv from 'dotenv';
dotenv.config({});

const serverlessConfiguration: AWS = {
  service: 'contracts-manager',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline', 'serverless-dynamodb-local'],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:DescribeTable',
              'dynamodb:Query',
              'dynamodb:Scan',
              'dynamodb:GetItem',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
              'dynamodb:DeleteItem',
            ],
            Resource: 'arn:aws:dynamodb:us-west-2:*:table/Users',
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: { login, register, getContract, getContractsIDs, createContract },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node18',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    dynamodb: {
      start: {
        port: 5000,
        inMemory: false,
        migrate: true,
        dbPath: './.dynamodb',
      },
      stages: 'dev',
    },
  },
  resources: {
    Resources: {
      UsersTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'UsersTable',
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S',
            },
            {
              AttributeName: 'username',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH',
            },
          ],

          ProvisionedThroughput: {
            ReadCapacityUnits: 1000,
            WriteCapacityUnits: 1000,
          },
          GlobalSecondaryIndexes: [
            {
              IndexName: 'usernameIndex', // Name of the global secondary index
              KeySchema: [
                {
                  AttributeName: 'username',
                  KeyType: 'HASH',
                },
              ],
              Projection: {
                ProjectionType: 'ALL', // Adjust projection type as needed
              },
              ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1,
              },
            },
          ],
        },
      },
      ContractsTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'ContractsTable',
          AttributeDefinitions: [
            {
              AttributeName: 'contractID',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'contractID',
              KeyType: 'HASH',
            },
          ],

          ProvisionedThroughput: {
            ReadCapacityUnits: 1000,
            WriteCapacityUnits: 1000,
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
