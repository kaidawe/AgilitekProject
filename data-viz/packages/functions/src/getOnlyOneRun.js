import { DynamoDB, QueryCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDB({
  region: "us-east-1",
});


const getAllRunsByIntegration = async (integrationId, runId) => {
// console.log("#### integrationId:::: ", integrationId, " runId: ", runId);
    const queryCommandInput = 
        {
            TableName: "fdp-integration-logging",
            KeyConditions:
                    {
                        pk: {
                            AttributeValueList: [
                                {
                                    S: integrationId
                                },
                            ],
                            ComparisonOperator: "EQ",        
                        },
                        id: {
                            AttributeValueList: [
                                {
                                    S: runId
                                },
                            ],
                            ComparisonOperator: "EQ",        
                        }
                    },
            ProjectionExpression: "pk, id, cls, log_details, run_start, run_end, run_status, step_history"
        };

        const queryCommand = new QueryCommand(queryCommandInput);
        const queryCommandResponse = await client.send(queryCommand);
// console.log("queryCommandResponse----- ", queryCommandResponse);

    return queryCommandResponse.Items[0].step_history.L;
};


// this function does:
// 1. cleans the objects inside the array of step_history, converting the data coming from DB to a plain json format
const transformData = data => {
    const result = [];
    let tempObj = {};
    let item = 0;

    try {
        for (item; item < data.length; item++) {
            tempObj = {};
            
            for (let prop in data[item].M)
                tempObj[prop] = prop !== "statistics"
                                    ? data[item].M[prop].S
                                    : data[item].M[prop].M;

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


export const handler = async (event) => {
    try {
        const t1 = Date.now(); // temp
        console.log("----- NOW1: " + Date(t1)); // temp
        const { integrationId } = event.queryStringParameters;
        const { runId } = event.queryStringParameters;
// console.log("#### integrationId:::: ", integrationId, " runId: ", runId)

        const run = await getAllRunsByIntegration(decodeURIComponent(integrationId), decodeURIComponent(runId));
        const stepHistory = run;
        const transformedData = transformData(stepHistory);

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