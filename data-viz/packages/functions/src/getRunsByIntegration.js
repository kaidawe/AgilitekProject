import { DynamoDB, QueryCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDB({
  region: "us-east-1",
});


const getAllRunsByIntegration = async (integration, date) => {
console.log("------------------ integrations: ", integration)

//     const queryOptions = integrations.length > 1
//         ? integrations.map(e => ({S: e}))
//         : integrations[0]
// console.log("queryOptions====== ", queryOptions)

    const queryCommandInput = 
        // integrations.length === 1
        //     ?
                {
                    TableName: "fdp-integration-logging",
                    KeyConditions:
                            {
                                pk: {
                                    AttributeValueList: [
                                        {
                                            // S: integrations[0]
                                            S: integration
                                        },
                                    ],
                                    ComparisonOperator: "EQ",        
                                }
                            },
                    ProjectionExpression: "pk, id, cls, log_details, run_start, run_end, run_status, step_history",
                    FilterExpression: "run_end > :date",
                    ExpressionAttributeValues: {
                        ":date": { S: date },
                    },
            //     }
            // :
            //     {
            //         TableName: "fdp-integration-logging",
            //         KeyConditions:
            //                 {
            //                     pk: {
            //                         AttributeValueList: queryOptions,
            //                         // AttributeValueList: [
            //                         //     {
            //                         //         S: integrations
            //                         //     },
            //                         // ],
            //                         ComparisonOperator: "IN"
            //                     }
            //                 },
            //         ProjectionExpression: "pk, id, cls, log_details, run_start, run_end, run_status, step_history",
            //         FilterExpression: "run_end > :date",
            //         ExpressionAttributeValues: {
            //             ":date": { S: date },
            //             // ":integrations": { L: integrations }
            //         }
                };
// console.log("------------------ queryComdInput: ", queryCommandInput)
// if (1) throw("OKKKKKKKKKKKK")

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

        // result.reverse();
        // return result;

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
        console.log("----- NOW1: " + Date(t1)); // temp
        // const { integrationId } = event.pathParameters;
        const { integrationId } = event.queryStringParameters;
        const { days } = event.queryStringParameters;

        console.log("************** ", integrationId, days);
        const integrations = integrationId.split(",");

        // if (1) return ({body: integrations});

        
        let date;
        if (days === "0") {
            date = new Date(0);
        } else {
            date = new Date(Date.now());
            date.setDate(date.getDate() - days);
            date = date.toISOString();
            const timezoneOffset = "000+000";
            date = date.slice(0, -1) + timezoneOffset;
        }
        
        // const runs = await getAllRunsByIntegration(integrations, date);
        const runs = [];
        for (let integration of integrations) {
            const tempRuns = await getAllRunsByIntegration(integration, date);
            console.log("integration============= ", integration, tempRuns.length)
            runs.push(...tempRuns);
        }

console.log("runs -----------", runs.length) // temp

//         // transform date coming from the database
        const transformedData = transformData(runs);

// console.log("transformedData -----------", transformedData[transformedData.length - 1], transformedData.length); //temp
const t2 = Date.now(); // temp
console.log("----- NOW2: " + Date(t2)); // temp
console.log("------- TOTAL TIME: " + ((t2 - t1) / 1000) + " seconds"); // temp

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

        // return {
        //   statusCode: 500,
        //   body: {
        //     msg: `Something went wrong... ${error}`,
        //   },
        // };
    }
};
