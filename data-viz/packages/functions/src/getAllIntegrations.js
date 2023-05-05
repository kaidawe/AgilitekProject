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
        const allIntegrations = [];
        for (let customer of incomingCustomers) {

            const tempIntegrations = await getAllIntegrations(customer);
            // console.log("integration for customer ============= ", tempIntegrations, tempIntegrations.length)
            allIntegrations.push(...tempIntegrations);
        }


        return {
            statusCode: 200,
            body: JSON.stringify(allIntegrations),
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
