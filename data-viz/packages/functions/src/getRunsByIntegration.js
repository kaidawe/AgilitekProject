import { DynamoDB, QueryCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDB({
  region: "us-east-1",
});

const getAllRunsByIntegration = async (integrationId, date) => {
  const date1 = new Date(Date.now());

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
      "pk, id, cls, log_details, run_start, run_end, run_status, step_history",
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
      // let copy = item;

      // // only grab the last message from step history
      // copy.last_message = copy.step_history.L.slice(-1)[0];
      // delete copy.step_history;

      runs.push(copy);
    });

    queryCommandResponse.LastEvaluatedKey !== undefined
      ? (queryCommandInput.ExclusiveStartKey =
          queryCommandResponse.LastEvaluatedKey)
      : (x = false);
  }

  const date2 = new Date(Date.now());

  const totalTime = new Date(date2 - date1);

  console.log(`Query Time Spent ${totalTime.getMilliseconds()} seconds`);
  return runs;
};

// this function does:
// 1. removes the step_history in each run,
// 2. adds a new property (errorMsg) when the run fails - based on the last message in step_history,
// 3. adds a new property (runTotalTime) for the total time spent in the run, and
// 4. converts the data coming from DB to a plain json format

const transformData = (data) => {
  const result = [];
  let tempObj = {};
  let runStart = "";
  let runEnd = "";
  let runTotal = "";
  let tempErrorMsg = "";
  let item = 0;

  try {
    for (item; item < data.length; item++) {
      tempObj = {};

      for (let prop in data[item]) {
        // dont think we need "cls" (idk about log_details, keeping it for now)
        // if that so, can skip for them and have less data to process and send
        // if (prop === "step_history" || prop === "cls" || prop === "log_details")
        if (prop === "step_history" || prop === "cls") continue;

        if (prop === "run_status" && data[item][prop].S === "failed") {
          const temp = data[item]["step_history"].L;
          // tempErrorMsg = (temp[temp.length - 1].M?.completed_step.S) || "no explicit error message #1"; //// it causes error
          tempErrorMsg = temp.length
            ? temp[temp.length - 1].M?.completed_step.S ||
              "no explicit error message #1"
            : "no explicit error message";
        }

        if (prop === "run_start") runStart = new Date(data[item][prop].S);

        if (prop === "run_end") runEnd = new Date(data[item][prop].S);

        tempObj[prop] = data[item][prop].S;
      }

      runTotal = runEnd - runStart;
      tempObj["runTotalTime"] =
        runTotal >= 0 ? (runTotal / 60000).toFixed(2) : 0;
      tempObj["errorMsg"] = tempErrorMsg || null;

      runTotal = 0;
      runStart = "";
      runEnd = "";
      tempErrorMsg = "";

      result.push(tempObj);
    }

    result.reverse();
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

export const handler = async (event) => {
  try {
    const { integrationId } = event.pathParameters;
    const { days } = event.queryStringParameters;

    let date;
    const timezoneOffset = "000+000";

    date = new Date(Date.now());
    date.setDate(date.getDate() - days);
    date = date.toISOString().slice(0, -1) + timezoneOffset;

    const runs = await getAllRunsByIntegration(integrationId, date);
    const transformedData = transformData(runs);

    return {
      statusCode: 200,
      body: JSON.stringify(transformedData),
    };
  } catch (error) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: error.message || error,
      }),
    };
  }
};
