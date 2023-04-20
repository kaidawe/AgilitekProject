import AWS from "aws-sdk";

const ddb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

export const handler = async (event) => {
  await readTable()
    .then((res) => {
      console.log(res);
      return {
        statusCode: 200,
        body: res.Items,
      };
    })
    .catch((err) => {
      return {
        statusCode: 404,
        body: {
          msg: err,
        },
      };
    });
};

function readTable() {
  const params = {
    TableName: "fdp-integration-logging",
    ScanFilter: {
      pk: {
        ComparisonOperator: "NOT_CONTAINS",
        AttributeValueList: {
          S: "INTEGRATION",
        },
      },
    },
  };
  return ddb.scan(params).promise();
}
