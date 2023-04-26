import { Api } from 'sst/constructs'

export function API({ stack }) {
  const api = new Api(stack, 'api', {
    routes: {
      'GET /': 'packages/functions/src/lambda.handler',
      'GET /customers': 'packages/functions/src/getCustomers.handler',
      'GET /integrations/{customer}':
        'packages/functions/src/getIntegrationsByCustomer.handler',
    },
  })
  stack.addOutputs({
    ApiEndpoint: api.url,
  })

  api.attachPermissions(['dynamodb'])

  return {
    api,
  }
}
