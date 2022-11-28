import {
  EventbridgeToLambda,
  EventbridgeToLambdaProps,
} from '@aws-solutions-constructs/aws-eventbridge-lambda';
import {
  aws_dynamodb,
  aws_events,
  aws_lambda,
  aws_lambda_nodejs,
  Duration,
} from 'aws-cdk-lib';
import { EventBus } from 'aws-cdk-lib/aws-events';
import { Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import * as path from 'path';

interface StoreSignupDynamoProps {
  eventBus: EventBus;
}

export class StoreSignupToDynamo extends Construct {
  constructor(scope: Construct, id: string, props: StoreSignupDynamoProps) {
    super(scope, id);

    // TODO DynamoDB Users table
    const usersTable = new aws_dynamodb.Table(this, 'UsersTable', {
      partitionKey: { name: 'id', type: aws_dynamodb.AttributeType.STRING },
      billingMode: aws_dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    const storeUserToDynamoFunction = new aws_lambda_nodejs.NodejsFunction(
      this,
      'StoreUserToDynamoFunction',
      {
        memorySize: 128,
        timeout: Duration.seconds(5),
        runtime: aws_lambda.Runtime.NODEJS_16_X,
        handler: 'handler',
        entry: path.join(__dirname, `/lambda/index.ts`),
        environment: {
          TABLE_NAME: usersTable.tableName,
        },
      }
    );

    storeUserToDynamoFunction.role?.attachInlinePolicy(
      new Policy(this, `StoreUserToDynamoPolicy`, {
        statements: [
          new PolicyStatement({
            actions: ['dynamodb:PutItem'],
            resources: [usersTable.tableArn],
          }),
        ],
      })
    );

    const constructProps: EventbridgeToLambdaProps = {
      existingLambdaObj: storeUserToDynamoFunction,
      existingEventBusInterface: props.eventBus,
      eventRuleProps: {
        eventPattern: {
          source: ['cep.cognito'],
          detailType: ['user.registration'],
        },
      },
    };

    new EventbridgeToLambda(
      this,
      'userSignupEventbridgeLambda',
      constructProps
    );
  }
}
