import { DynamoDB, QueryCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDB({
  region: "us-east-1",
});

const getAllRunsByIntegration = async (integration, date1, date2) => {
  const queryCommandInput = {
    TableName: "fdp-integration-logging",
    IndexName: "pk-run_end-index",
    KeyConditions: {
      pk: {
        AttributeValueList: [
          {
            S: integration,
          },
        ],
        ComparisonOperator: "EQ",
      },
      run_end: {
        AttributeValueList: [
          {
            S: date1, // Date 7 days previously
          },
          {
            S: date2, // Current Date
          },
        ],
        ComparisonOperator: "BETWEEN",
      },
    },
    ProjectionExpression:
      "pk, id, cls, log_details, run_start, run_end, run_status",
  };

  let x = true;
  let runs = [];

  while (x) {
    const queryCommand = new QueryCommand(queryCommandInput);
    const queryCommandResponse = await client.send(queryCommand);

    queryCommandResponse.Items.forEach((item) => {
      // Calculate the total time the Run took to complete the job
      let runTotal = (
        (new Date(item.run_end.S) - new Date(item.run_start.S)) /
        60000
      ).toFixed(2);

      runTotal = runTotal.toString().split(".");
      let mins = runTotal[0];
      let seconds = runTotal[1];

      runs.push({
        // format the data
        id: item.id.S,
        pk: item.pk.S,
        run_status: item.run_status.S,
        run_start: item.run_start.S,
        run_end: item.run_end.S,
        log_details: item.log_details.S,
        runTotalTime: `${mins} minutes ${seconds} seconds.`,
      });
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
    const { integrations } = event.queryStringParameters;
    const integrationsArray = integrations.split(",");

    let today = new Date("2022-11-15");

    // uncomment the line below and delete the line above for production
    // to grab all the latest runs for an integration

    // let today = new Date(Date.now());

    let todayMinusAWeek = new Date(today - 7 * 24 * 60 * 60 * 1000);
    todayMinusAWeek.setUTCHours(0, 0, 0, 0);

    // format the date to match the date in the table
    today = today.toISOString();
    today = today.substring(0, today.length - 1) + "000+000";

    todayMinusAWeek = todayMinusAWeek.toISOString();
    todayMinusAWeek =
      todayMinusAWeek.substring(0, todayMinusAWeek.length - 1) + "000+000";

    const runs = [];
    for (let integration of integrationsArray) {
      const tempRuns = await getAllRunsByIntegration(
        integration,
        todayMinusAWeek,
        today
      );

      runs.push(...tempRuns);
    }

    return {
      statusCode: 200,
      body: JSON.stringify(runs),
    };
  } catch (error) {
    console.log("ERROR: ", error.message || error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error.message || error,
      }),
    };
  }
};
