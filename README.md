# contracts-manager
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

Congratulations! You have successfully set up the Serverless Framework on your PC. You can now start building and deploying serverless applications using the Serverless Framework.
