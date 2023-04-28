import { DynamoDB, QueryCommand } from '@aws-sdk/client-dynamodb'

const client = new DynamoDB({
  region: 'us-east-1',
})

const getAllIntegrations = async (customer) => {
  // Query Command Input to grab all integrations by customers from DynamoDB
  const queryCommandInput = {
    TableName: 'fdp-integration-logging',
    KeyConditions: {
      pk: {
        AttributeValueList: [
          {
            S: customer,
          },
        ],
        ComparisonOperator: 'EQ', // pk == customer
      },
    },
  }
  let x = true
  let integrations = []

  while (x) {
    const queryCommand = new QueryCommand(queryCommandInput)
    const queryCommandResponse = await client.send(queryCommand)

    queryCommandResponse.Items.forEach((item) => {
      integrations.push(item)
    })

    queryCommandResponse.LastEvaluatedKey !== undefined
      ? (queryCommandInput.ExclusiveStartKey =
          queryCommandResponse.LastEvaluatedKey)
      : (x = false)
  }

  return integrations
}

const getRunsSinceYesterday = async (integrationId) => {
  const now = new Date()
  const yesterday = new Date(now.setDate(now.getDate() - 1))
  const yesterdayDateString = `${yesterday.getFullYear()}-${yesterday.getMonth()}-${yesterday.getDate()}T00:00:00.000000+0000`

  const queryCommandInput = {
    TableName: 'fdp-integration-logging',
    KeyConditions: {
      pk: {
        AttributeValueList: [
          {
            S: integrationId,
          },
        ],
        ComparisonOperator: 'EQ',
      },
    },
    ProjectionExpression:
      'pk, id, cls, log_details, run_start, run_end, run_status',
    FilterExpression: 'run_start > :date',
    ExpressionAttributeValues: {
      ':date': { S: yesterdayDateString },
    },
  }

  let x = true
  let runs = []

  while (x) {
    const queryCommand = new QueryCommand(queryCommandInput)
    const queryCommandResponse = await client.send(queryCommand)

    queryCommandResponse.Items.forEach((item) => {
      runs.push(item)
    })

    queryCommandResponse.LastEvaluatedKey !== undefined
      ? (queryCommandInput.ExclusiveStartKey =
          queryCommandResponse.LastEvaluatedKey)
      : (x = false)
  }

  console.log('runs since yesterday have been gotten')
  return runs
}

// const whileLoop = async (queryCommandInput) => {
//   let x = true
//   let runs = []
//   while (x) {
//     const queryCommand = new QueryCommand(queryCommandInput)
//     const queryCommandResponse = await client.send(queryCommand)

//     queryCommandResponse.Items.forEach((item) => {
//       runs.push(item)
//     })

//     queryCommandResponse.LastEvaluatedKey !== undefined
//       ? (queryCommandInput.ExclusiveStartKey =
//           queryCommandResponse.LastEvaluatedKey)
//       : (x = false)
//   }

//   return runs
// }

const checkIntegrations = async (integrations) => {
  await integrations.forEach(async (integration) => {
    const runs = await getRunsSinceYesterday(integration.id.S)
    console.log('runs', runs)
    if (runs.length == 0) {
      integration.missed_run = true
    } else {
      integration.missed_run = false
    }
    console.log(integration)
  })

  return integrations
}

export const handler = async (event) => {
  try {
    const { customer } = event.pathParameters
    const integrations = await getAllIntegrations(customer)
    console.log('got all integrations')
    const updatedIntegrations = await checkIntegrations(integrations)

    console.log('after update')
    console.log('updated ints', updatedIntegrations)

    return {
      statusCode: 200,
      body: JSON.stringify(integrations),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: {
        msg: `Something went wrong... ${error}`,
      },
    }
  }
}
