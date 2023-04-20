import { DynamoDB } from "aws-sdk";

export const handler = async (event) => {
  const docClient = DynamoDB.DocumentClient({ region: "us-east-1" });

  const query = async () => {
    const res = await docClient.query({
      TableName: "fdp-integration-logging",
    });
  };

  const response = {
    statusCode: 200,
    body: JSON.stringify("Hello from Lambda!"),
  };

  return response;
};
