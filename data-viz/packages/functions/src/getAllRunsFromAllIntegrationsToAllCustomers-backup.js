import { DynamoDB, QueryCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDB({
  region: "us-east-1",
});


const getAllRunsByIntegration = async (integration, date1, date2) => {
    const queryCommandInput = 
                {
                    TableName: "fdp-integration-logging",
                    KeyConditions:
                            {
                                pk: {
                                    AttributeValueList: [
                                        {
                                            S: integration
                                        },
                                    ],
                                    ComparisonOperator: "EQ",        
                                }
                            },
                    ProjectionExpression: "pk, id, cls, log_details, run_start, run_end, run_status, step_history",
                    FilterExpression: "run_start > :date1 AND run_start < :date2",
                    ExpressionAttributeValues: {
                        ":date1": { S: date1 },
                        ":date2": { S: date2 },
                    }
                };

    let x = true;
    let runs = [];

    while (x) {
        const queryCommand = new QueryCommand(queryCommandInput);
        const queryCommandResponse = await client.send(queryCommand);

        queryCommandResponse.Items.forEach((item) => {
            item.test = "test";
            runs.push(item);
        });

        queryCommandResponse.LastEvaluatedKey !== undefined
            ? (queryCommandInput.ExclusiveStartKey = queryCommandResponse.LastEvaluatedKey)
            : (x = false);
    }

    return runs;
};


// this function does:
// 1. removes the step_history in each run,
// 2. adds a new property (errorMsg) when the run fails - based on the last message in step_history,
// 3. adds a new property (runTotalTime) for the total time spent in the run, and
// 4. converts the data coming from DB to a plain json format
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
            tempObj = {};
            
            for (let prop in data[item]) {
                // dont think we need "cls" (idk about log_details, keeping it for now)
                // if that so, can skip for them and have less data to process and send
                // if (prop === "step_history" || prop === "cls" || prop === "log_details")
                if (prop === "step_history" || prop === "cls")
                    continue;
            
                if ((prop === "run_status") && (data[item][prop].S === "failed")) {
                    const temp = data[item]["step_history"].L; 
                    // tempErrorMsg = (temp[temp.length - 1].M?.completed_step.S) || "no explicit error message #1"; //// it causes error
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
            tempObj["runTotalTime"] = runTotal >= 0 ? (runTotal / 60000).toFixed(2) : 0;
            tempObj["errorMsg"] = tempErrorMsg || null;

            runTotal = 0;
            runStart = ""; runEnd = ""; tempErrorMsg = "";

            result.push(tempObj);
        }

        const resultSortedByrun_start = result.sort((a, b) => new Date(b.run_start) - new Date(a.run_start))
        return resultSortedByrun_start;
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
        const t1 = Date.now(); // temp
        console.log("----- NOW1: " + Date(t1)); // temp;

        const { integrations } = event.queryStringParameters;
        const integrationsArray = integrations.split(",");


        const days = 6; // counting today + 6 days backwards = total 7 days

        // const today = new Date(Date.now()); 
        //////
        // *****  when in production, please uncomment the line above and comment out the line below *****
        //////
        const today = new Date(1668441600000); // for demonstration purposes, today is Nov 14, 2022 - 16:00 (UTC)

        const finalDatePeriod = new Date(today.setUTCHours(23, 59, 59));
        // ^^ it sets the final date (in production supposedly, today) to be 23:59 UTC

        const tempDate2 = new Date(today.setDate(today.getDate() - days));
        const initialDatePeriod = new Date(tempDate2.setUTCHours(0, 0, 0,0 ));
        // ^^ it sets the initial date to be 7 DAYS back (or the value coming from days variable) at 00:00 UTC
        
        console.log("***** -FROM: ", initialDatePeriod, " -TO: ", finalDatePeriod, " -DT NOW:::: ", new Date(Date.now()));

        const runs = [];
        for (let integration of integrationsArray) {
            const tempRuns = await getAllRunsByIntegration(integration, initialDatePeriod, finalDatePeriod);
            runs.push(...tempRuns);
            console.log("integration============= ", integration, tempRuns.length, " --- ", runs.length)
        }

console.log("runs -----------", runs.length) // temp

    const t2 = Date.now(); // temp
    console.log("----- NOW2: " + Date(t2)); // temp
    console.log("------- TOTAL TIME: " + ((t2 - t1) / 1000) + " seconds"); // temp
//         // transform date coming from the database
        const transformedData = transformData(runs);

const t3 = Date.now(); // temp
console.log("----- NOW3: " + Date(t3)); // temp
console.log("------- TOTAL TIME: " + ((t3 - t1) / 1000) + " seconds"); // temp

        return {
            statusCode: 200,
            body: JSON.stringify(transformedData)
        };

    } catch (error) {
        console.log("###ERROR: ", error.message || error);
        const msg = [{
            error: true,
            message: error.message || error,
        }];

        return ({
            statusCode: 200,
            body: JSON.stringify(msg)
        });
    }
};