import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  QueryCommand,
  GetCommand,
 
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "test";
const params = {
  TableName: "test",
  FilterExpression: "NOT contains (pk, :integration) ",
  ExpressionAttributeValues: {
    ":integration": "INTEGRATION"
  }
  ,

     ProjectionExpression: "pk, data_source"


};






export const handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    switch (event.routeKey) {



      case "GET /integrations":

       const  data = await dynamo.send(new ScanCommand(params));



        console.log("step--------",body);

const uniqueItems = [];
const pkSet = new Set();

for (const item of data.Items) {
  const pk = item.pk.S;
  if (!pkSet.has(pk)) {
    uniqueItems.push(item);
    pkSet.add(pk);
  }
}

body = uniqueItems;



        break;

      default:
        throw new Error();
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
};

