import { DynamoDB, ScanCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDB({
  region: "us-east-1",
});

export const handler = async (event) => {
  // Scan Command Input to grab unique list of customers from DynamoDB
  const scanCommandInput = {
    TableName: "fdp-customers",
    Select: "ALL_ATTRIBUTES",
  };

  let x = true;
  let customers = [];

  try {
    while (x) {
      const scanCommand = new ScanCommand(scanCommandInput);
      const scanCommandResponse = await client.send(scanCommand);

      scanCommandResponse.Items.forEach((x) => {
        // if customer does not exist in array, push
        if (!customers.includes(x.customer.S)) {
          customers.push(x.customer.S);
        }
      });
      // if LastEvaluatedKey is undefined, we've reached the
      // last page of the pagination
      scanCommandResponse.LastEvaluatedKey !== undefined
        ? (scanCommandInput.ExclusiveStartKey =
            scanCommandResponse.LastEvaluatedKey)
        : (x = false);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        customers: customers,
      }),
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
