#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CepCdkHackatonStack } from '../lib/cep-cdk-hackaton-stack';

const app = new cdk.App();
new CepCdkHackatonStack(app, 'CepCdkHackatonStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
