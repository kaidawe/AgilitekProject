import { DynamoDB, QueryCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDB({
  region: "us-east-1",
});

const getAllIntegrations = async (customer) => {
  // Query Command Input to grab all integrations by customers from DynamoDB
  const queryCommandInput = {
    TableName: "fdp-integration-logging",
    KeyConditions: {
      pk: {
        AttributeValueList: [
          {
            S: customer,
          },
        ],
        ComparisonOperator: "EQ", // pk == customer
      },
    },
  };
  let x = true;
  let integrations = [];

  while (x) {
    const queryCommand = new QueryCommand(queryCommandInput);
    const queryCommandResponse = await client.send(queryCommand);

    queryCommandResponse.Items.forEach((item) => {
      integrations.push(item);
    });

    queryCommandResponse.LastEvaluatedKey !== undefined
      ? (queryCommandInput.ExclusiveStartKey =
          queryCommandResponse.LastEvaluatedKey)
      : (x = false);
  }

  return integrations;
};

// const getAllRunsPerIntegration = async (integration) => {
//   const queryCommandInput = {
//     TableName: "fdp-integration-logging",
//     KeyConditions: {
//       pk: {
//         AttributeValueList: [
//           {
//             S: integration,
//           },
//         ],
//         ComparisonOperator: "EQ",
//       },
//     },
//   };

//   let x = true;
//   let runs = [];

//   while (x) {
//     const queryCommand = new QueryCommand(queryCommandInput);
//     const queryCommandResponse = await client.send(queryCommand);

//     queryCommandResponse.Items.forEach((item) => {
//       runs.push(item);
//     });

//     queryCommandResponse.LastEvaluatedKey !== undefined
//       ? (queryCommandInput.ExclusiveStartKey =
//           queryCommandResponse.LastEvaluatedKey)
//       : (x = false);
//   }

//   return runs;
// };

export const handler = async (event) => {
  try {
    const { customer } = event.pathParameters;
    const integrations = await getAllIntegrations(customer);
    // console.log(integrations);

    // for (let i = 0; i < integrations.length; i++) {
    //   integrations[i].runs = await getAllRunsPerIntegration(
    //     integrations[i].id.S
    //   );
    // }

    return {
      statusCode: 200,
      body: JSON.stringify(integrations),
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
