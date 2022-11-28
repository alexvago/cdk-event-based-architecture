import { EventBridgeHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const ddbClient = new DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME as string;

interface Detail {
  userName: string;
  sub: string;
  firstName: string;
  lastName: string;
  email: string;
}

export const handler: EventBridgeHandler<
  'user.registration',
  Detail,
  void
> = async (event) => {
  console.log('event', event);

  const detail = event.detail;

  try {
    const result = await ddbClient
      .put({
        TableName: tableName,
        Item: detail,
      })
      .promise();
    console.log('DynamoDB put item result', result);
  } catch (err) {
    console.error(err);
  }
};
