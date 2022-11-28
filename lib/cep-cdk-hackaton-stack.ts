import * as cdk from 'aws-cdk-lib';
import { EventBus } from 'aws-cdk-lib/aws-events';
import { Construct } from 'constructs';
import { Cognito } from './constructs/cognito';
import { StoreSignupToDynamo } from './constructs/storeSignupDynamo';

export class CepCdkHackatonStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bus = new EventBus(this, `EventBus`, {
      eventBusName: 'CognitoTriggersEventBus',
    });

    new Cognito(this, 'cognito', { prefix: 'avago', eventBus: bus });

    new StoreSignupToDynamo(this, 'storeSignupToDynamo', { eventBus: bus });
  }
}
