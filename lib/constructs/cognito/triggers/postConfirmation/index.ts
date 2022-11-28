import { PostConfirmationTriggerHandler } from 'aws-lambda';
import { EventBridge } from 'aws-sdk';
import { PutEventsRequestEntry } from 'aws-sdk/clients/eventbridge';

const eventBridge = new EventBridge({ apiVersion: '2015-10-07' });

const BUS_NAME = process.env.BUS_NAME as string;

export const handler: PostConfirmationTriggerHandler = async (event) => {
  if (event.triggerSource !== 'PostConfirmation_ConfirmSignUp') return event;

  console.log(event);

  const {
    userName,
    userPoolId,
    request: { userAttributes },
  } = event;

  const payload: PutEventsRequestEntry = {
    Time: new Date(),
    EventBusName: BUS_NAME,
    Source: 'cep.cognito',
    DetailType: 'user.registration',
    Detail: JSON.stringify({
      id: userAttributes['sub'],
      userName,
      firstName: userAttributes['given_name'],
      lastName: userAttributes['family_name'],
      email: userAttributes['email'],
    }),
  };

  try {
    await eventBridge.putEvents({ Entries: [payload] }).promise();
  } catch (error) {
    console.error(error);
  }

  return event;
};
