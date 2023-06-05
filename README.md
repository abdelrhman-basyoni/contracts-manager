# contracts-manager
Contracts Manager is a project that utilizes the Serverless framework with TypeScript to develop AWS Lambda functions locally. It also includes an instance of DynamoDB that runs locally for data storage.
## Project - Setup Guide

This guide provides step-by-step instructions on how to run the Serverless Framework on a new PC

### Prerequisites
Before you begin, ensure that you have the following prerequisites installed on your PC:
- Node.js version 18 and npm (Node Package Manager)
- Java Runtime Environment (JRE) version 6 or later

### Step 1: Install Serverless Framework
Open your command line interface and run the following command to install the Serverless Framework globally:

```
npm install -g serverless
```

### Step 2: Install Java Runtime Environment (JRE)
If you don't have Java Runtime Environment (JRE) installed on your PC, download and install the latest version from the official Oracle website.

### Step 3: Install Dependencies
Navigate to the directory of the project and run the following command to install the project dependencies:

```
npm install
```

This command will install all the required dependencies specified in the `package.json` file.

### Step 4: Install Serverless DynamoDB Plugin 
In order to use DynamoDB locally during development, you can install the Serverless DynamoDB plugin. Run the following command to install the plugin:

```
serverless dynamodb install
```

This command will install the necessary dependencies and configure DynamoDB for local development.

### Step 5: Start the Serverless Offline Plugin
To run your serverless application locally, you can use the Serverless Offline plugin. Run the following command to start the plugin:

```
serverless offline start
```

This command will start the local server and allow you to test and debug your serverless application on your PC.
## Testing
  In order to test the project you can run 
```
npm run test
```
for test coverage you can run 
```
npm run test:cov
```
## Code formating and linting
For lint  check yuo can run 
```
npm run lint
```
and for auto-fix ( Still cant fix all isssues )
```
npm run lint:fix
```
And for formating according to the .prettierrc
```
npm run format
```

## API Documentation

This document provides the documentation for the API endpoints of the application.

### Login

**Endpoint**: `http://localhost:3000/dev/login`
**Method**: POST
**Description**: This endpoint is used for user login.

**Request Body**:
```json
{
  "username": "topLegalUser",
  "password": "top@2023"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRvcExlZ2FsVXNlciIsImlhdCI6MTY4NTk2NzA0NywiZXhwIjoxNjkxMTUxMDQ3fQ.x_y3yg1y-d7VaXemvXejK2-PpKVN-fGqiZcwE80yL08",
    "userID": "08494642-9de6-4a60-92e6-0df4d27c90b9"
  }
}
```

### Create Contract

**Endpoint**: `http://localhost:3000/dev/createContract`
**Method**: POST
**Description**: This endpoint is used to create a new contract.

**Request Headers**:
```
Authorization: Bearer <access_token>
```

**Request Body**:
```json
{
  "userID": "08494642-9de6-4a60-92e6-0df4d27c90b9",
  "contractName": "first-contract",
  "templateID": "08494642-9de6-4a60-92e6-0df4d27c90b9"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "contractID": "3ac82e42-6c0c-4446-8e61-0e6a7ad414c9"
  }
}
```

### Get Contract IDs

**Endpoint**: `http://localhost:3000/dev/getContractIDs`
**Method**: GET
**Description**: This endpoint is used to retrieve the contract IDs.

**Request Headers**:
```
Authorization: Bearer <access_token>
```

**Response**:
```json
{
  "success": true,
  "data": {
    "contractsIDs": [
      {
        "contractID": "3ac82e42-6c0c-4446-8e61-0e6a7ad414c9"
      }
    ]
  }
}
```

### Get Contract

**Endpoint**: `http://localhost:3000/dev/getContract?id=3ac82e42-6c0c-4446-8e61-0e6a7ad414c9`
**Method**: GET
**Description**: This endpoint is used to retrieve a specific contract by its ID.

**Request Headers**:
```
Authorization: Bearer <access_token>
```

**Response**:
```json
{
  "success": true,
  "data": {
    "contractID": "3ac82e42-6c0c-4446-8e61-0e6a7ad414c9",
    "userID": "08494642-9de6-4a60-92e6-0df4d27c90b9",
    "contractName": "first-contract",
    "templateID": "08494642-9de6-4a60-92e6-0df4d27c90b9"
  }
}
```

**Note**: Replace `<access_token>` in the request headers with the actual access token obtained from the login response.


## Future Features

The following features will be added to enhance the functionality of Contracts Manager:

1. Logging: Implement a logging system to track and record important events and actions within the application. This will provide valuable insights for troubleshooting and monitoring the system.

2. Integration Test Script: Develop an integration test script that will automate the testing process for the Contracts Manager application. This script will ensure the smooth integration of various components and functionalities, helping to identify and resolve any issues before deployment.
