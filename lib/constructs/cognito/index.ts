import {
  aws_cognito,
  aws_iam,
  aws_lambda,
  aws_lambda_nodejs,
  CfnOutput,
  Duration,
} from 'aws-cdk-lib';
import { EventBus } from 'aws-cdk-lib/aws-events';
import { Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import * as path from 'path';

export interface CognitoProps {
  prefix: string;
  eventBus: EventBus;
}

export class Cognito extends Construct {
  constructor(scope: Construct, id: string, props: CognitoProps) {
    super(scope, id);

    const postConfirmationFunction = new aws_lambda_nodejs.NodejsFunction(
      this,
      'postConfirmationFunction',
      {
        memorySize: 128,
        timeout: Duration.seconds(5),
        runtime: aws_lambda.Runtime.NODEJS_16_X,
        handler: 'handler',
        entry: path.join(__dirname, `/triggers/postConfirmation/index.ts`),
        environment: {
          BUS_NAME: props.eventBus.eventBusName,
        },
      }
    );

    postConfirmationFunction.role?.attachInlinePolicy(
      new Policy(this, `PostConfirmationEventBusPolicy`, {
        statements: [
          new PolicyStatement({
            actions: ['events:PutEvents'],
            resources: [props.eventBus.eventBusArn],
          }),
        ],
      })
    );

    const userPool = new aws_cognito.UserPool(this, 'userpool', {
      userPoolName: `${props.prefix}-userpool`,
      signInCaseSensitive: false, // case insensitive is preferred in most situations

      selfSignUpEnabled: true,
      autoVerify: { email: true }, // needed to send verification email
      userVerification: {
        emailSubject: 'Verify your email for our awesome app!',
        emailBody:
          'Thanks for signing up to our awesome app! Your verification code is {####}',
        emailStyle: aws_cognito.VerificationEmailStyle.CODE,
        smsMessage:
          'Thanks for signing up to our awesome app! Your verification code is {####}',
      },

      lambdaTriggers: {
        postConfirmation: postConfirmationFunction,
      },
    });

    const client = userPool.addClient('app-client');

    new CfnOutput(this, 'userPoolId', {
      value: userPool.userPoolId,
    });

    new CfnOutput(this, 'userPoolClientId', {
      value: client.userPoolClientId,
    });
  }
}
