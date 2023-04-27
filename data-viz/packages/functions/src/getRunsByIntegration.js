import { DynamoDB, QueryCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDB({
  region: "us-east-1",
});

const getAllRunsByIntegration = async (integrationId) => {
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


// this function does:
// 1. removes the step_history in each run, 
// 2. adds a new property (errorMsg) when the run fails - based on the last message in step_history,
// 3. adds a new property (runTotalTime) for the total time spent in the run, and
// 4. converts the data coming from DB to a straightforward json format
const transformData = data => {
    const result = [];
    let tempObj = {};
    let runStart = "";
    let runEnd = "";
    let runTotal = "";
    let tempErrorMsg = "";
    let item = 0;

    try {
        for (item; item < data.length; item++) {
            console.log(item + 1);
            
            tempObj = {};
            
            for (let prop in data[item]) {
                if (prop === "step_history")
                    continue;
            
                if ((prop === "run_status") && (data[item][prop].S === "failed")) {
                    const temp = data[item]["step_history"].L; 
                    // tempErrorMsg = (temp[temp.length - 1].M?.completed_step.S) || "no explicit error message #1"
                    tempErrorMsg = temp.length 
                                        ? (temp[temp.length - 1].M?.completed_step.S) || "no explicit error message #1"
                                        : "no explicit error message";
                }
            
                if (prop === "run_start")
                    runStart = new Date(data[item][prop].S);
            
                if (prop === "run_end")
                    runEnd = new Date(data[item][prop].S);

                tempObj[prop] = data[item][prop].S;
            }

            runTotal = runEnd - runStart;
            tempObj["runTotalTime"] = runTotal >= 0 ? ((runTotal / 60000).toFixed(2)) : 0;
            tempObj["errorMsg"] = tempErrorMsg || null;

            runTotal = 0; runStart = "", runEnd = ""; tempErrorMsg = "";

            result.push(tempObj);
            
        }

        return result;
    } catch(err) {
        console.log("###ERROR: ", err.message || err);
        return [`Error: (${err.message || err}) - row ${item}`];
    }
}

export const handler = async (event) => {
  try {
    const { integrationId } = event.pathParameters;
// console.log("\n\n----------------------------------\nintegrationId::: ", integrationId);
    const integrations = await getAllRunsByIntegration(integrationId);
// console.log("integrations: ", integrationId, "\n", integrations.length);
// console.log("----------------------------------\n", integrationId);

    const transformedData = transformData(integrations);


    return {
      statusCode: 200,
    //   body: JSON.stringify(integrations),
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
