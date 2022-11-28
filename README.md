# Welcome to CEP CDK Hackaton

After this you should have a basic comprehensive knowledge of how CDK works and how to setup a project with it.

## Getting started

Let's start by [setting up our local environment](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html).

Then, open up a terminal, create a folder called `cep-hackaton-{YOUR_NAME}` (e.g. `cep-hackaton-avago`)

```
mkdir cep-hackaton-avago
cd cep-hackaton-avago
```

Now let's initialise the cdk project with

```
cdk init app --language typescript
```

To build TypeScript lambda code, we will also need an additional dependency, [`esbuild`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda_nodejs-readme.html#local-bundling), so let's install it

```
npm install --save-dev esbuild
```

## Target architecture

We will try to build something resembling the following architecture, handling user registration.

![Target architecture](https://www.sorenandersen.com/static/d16238efe43daa4287b6b3d21c8ba9cd/a3bed/01-register-user-diagram.png)

## AWS Services CDK documentation

- [Cognito](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_cognito-readme.html) - Authentication and Authorization as a Service
- [Lambda](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda-readme.html) - Serverless computing service
- [EventBridge](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_events-readme.html) - Serverless event bus
- [DynamoDB](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_dynamodb-readme.html) - Serverless NoSQL database

## Useful setup configs

- Environment definition for the Stack
  - update the your stack instance in the file in `/bin/` folder by replacing all comments with the following line:

```ts
env: { account: '*AWS_ACCOUNT_NUMBER*', region: 'eu-west-1' }
```

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template
