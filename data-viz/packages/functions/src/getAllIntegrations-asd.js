import { DynamoDB, QueryCommand, BatchGetItemCommand } from "@aws-sdk/client-dynamodb";
// import AWS from "aws-sdk";
const client = new DynamoDB({
    region: "us-east-1",
});


const getAllIntegrations = async (customer) => {
    // Query Command Input to grab all integrations by customers from DynamoDB
    // const queryCommandInput = {
    //     TableName: "fdp-integration-logging",
    //     KeyConditions: {
    //         pk: {
    //             AttributeValueList: [
    //                 {
    //                     S: customer,
    //                 },
    //             ],
    //             ComparisonOperator: "EQ", // pk == customer
    //         },
    //     },
    // };
//     const temp = customer.map(e => ({S: e}));
// console.log("temp===== ", temp)
    const queryCommandInput = {
        TableName: "fdp-integration-logging",
        KeyConditions: {
            pk: {
                AttributeValueList: [
                    {
                        S: "DUCKS",
                    },
                    {
                        S: "RSL"
                    }
                ],
                ComparisonOperator: "IN", // pk == customer
            },
        },
    };

    // const queryCommandInput = {
    //     TableName: "fdp-integration-logging",
    //     KeyCondition: '#partitionKey IN (:pks)',
    //     ExpressionAttributeNames: {
    //         '#partitionKey': "pk"
    //     },
    //     ExpressionAttributeValues: {
    //         ':pks': customer
    //     },
    //     ComparisonOperator: 'IN'
    // };

    // const BatchGetItemCommandInput = {
    //     RequestItems: {
    //         "fdp-integration-logging": {
    //             Keys: [
    //                 {
    //                     pk: {
    //                         S: "DUCKS"
    //                     }
    //                 },
    //                 {
    //                     pk: {
    //                         S: "RSL"
    //                     }
    //                 }
    //             ]
    //         }
    //     }
    // }
// console.log("queryCommandInput:::: ", BatchGetItemCommandInput)


    let x = true;
    let integrations = [];

    try {
        console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX ", x);
        const queryCommand = new QueryCommand(queryCommandInput);
        const queryCommandResponse = await client.send(queryCommand);
        console.log("queryCommandResponse::: ", queryCommandResponse)
        
        // const command = new BatchGetItemCommand(BatchGetItemCommandInput);
        // const response = await client.send(command);
        // console.log("***queryCommandResponse::: ", response)
        

        // const dynamoDb = new AWS.DynamoDB.DocumentClient();

        // const pks = ['DUCKS', 'RSL'];

        // const params = {
        //     TableName: "fdp-integration-logging",
        //     KeyConditionExpression: '#partitionKey IN (:pks)',
        //     ExpressionAttributeNames: {
        //         '#partitionKey': "pk"
        //     },
        //     ExpressionAttributeValues: {
        //         ':pks': pks
        //     }
        // };

        // dynamoDb.query(params, (err, data) => {
        //     if (err) {
        //         console.error("**************err ", err);
        //     } else {
        //         console.log("*************YEAHHHH: ", data);
        //     }
        // });
        // if (1) return;
    } catch(error) {
        console.log("###ERROR: ", error.message || error)
    }
    while (x) {

        queryCommandResponse.Items.forEach((item) => {
            let temp = {};
            for (let i in item)
                temp[i] = item[i].S;
            
            integrations.push(temp);
        });

        queryCommandResponse.LastEvaluatedKey !== undefined
            ? (queryCommandInput.ExclusiveStartKey =
                queryCommandResponse.LastEvaluatedKey)
            : (x = false);
    }

    return integrations;
};


export const handler = async (event) => {
    try {
        const { customers } = event.queryStringParameters;

        const incomingCustomers = customers.split(",");
console.log("incomingCustomers===== ", incomingCustomers)

const tempIntegrations = await getAllIntegrations(incomingCustomers);
console.log("tempIntegrations:::: ", tempIntegrations)
        // const allIntegrations = [];
        // for (let customer of incomingCustomers) {

        //     const tempIntegrations = await getAllIntegrations(customer);
        //     // console.log("integration for customer ============= ", tempIntegrations, tempIntegrations.length)
        //     allIntegrations.push(...tempIntegrations);
        // }


        return {
            statusCode: 200,
            body: JSON.stringify("allIntegrations"),
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
