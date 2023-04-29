import { DynamoDB, QueryCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDB({
  region: "us-east-1",
});


// this function does:
// 1. converts the data coming from DB to a straightforward json format
const transformData = data => {
    const result = [];
    let tempObj = {};
    let item = 0;
  
    try {
        for (item; item < data.length; item++) {
            tempObj = {};
    
            for (let prop in data[item])
                tempObj[prop] = data[item][prop].S;

            result.push(tempObj);
        }

        return result;
    } catch (err) {
          console.log("###ERROR: ", err.message || err);
          return [
              {
                  error: true,
                  message: err.message || err,
                  pk: data[item - 1]["pk"].S,
                  id: data[item - 1]["id"].S,
                  row: item,
              },
          ];
    }
};


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

//   console.log("customer: ", customer + "----- integrations:::: ", integrations);

  return integrations;
};

export const handler = async (event) => {
  try {
    const { customer } = event.pathParameters;
    const integrations = await getAllIntegrations(customer);

    const transformedData = transformData(integrations);
    // console.log("transformedData::: ", transformedData);

    return {
      statusCode: 200,
      body: JSON.stringify(transformedData),
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
