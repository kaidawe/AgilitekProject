import { DynamoDB, QueryCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDB({
  region: "us-east-1",
});

const getAllRunsByIntegration = async (integrationId, date) => {
  const queryCommandInput = {
    TableName: "fdp-integration-logging",
    KeyConditions: {
      pk: {
        AttributeValueList: [
          {
            S: integrationId,
          },
        ],
        ComparisonOperator: "EQ",
      },
    },
    ProjectionExpression:
      "pk, id, cls, log_details, run_start, run_end, run_status",
    FilterExpression: "run_end > :date",
    ExpressionAttributeValues: {
      ":date": { S: date },
    },
  };

  let x = true;
  let runs = [];

  while (x) {
    const queryCommand = new QueryCommand(queryCommandInput);
    const queryCommandResponse = await client.send(queryCommand);

    queryCommandResponse.Items.forEach((item) => {
      runs.push(item);
    });

    queryCommandResponse.LastEvaluatedKey !== undefined
      ? (queryCommandInput.ExclusiveStartKey =
          queryCommandResponse.LastEvaluatedKey)
      : (x = false);
  }

  return runs;
};

export const handler = async (event) => {
  try {
    const { integrationId } = event.pathParameters;

    // transform date into how it is formatted in the database.
    let date = new Date(Date.now());
    date.setDate(date.getDate() - 100);
    date = date.toISOString();

    const timezoneOffset = "000+000";
    date = date.slice(0, -1) + timezoneOffset;

    const runs = await getAllRunsByIntegration(integrationId, date);

    return {
      statusCode: 200,
      body: JSON.stringify(runs),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: {
        msg: `Something went wrong... ${error}`,
      },
    };
  }
};
