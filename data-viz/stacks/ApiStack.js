import { Api } from 'sst/constructs'

export function API({ stack }) {
  const api = new Api(stack, 'api', {
    routes: {
      'GET /api/customers': 'packages/functions/src/getCustomers.handler',
      'GET /api/integrations/{customer}':
        'packages/functions/src/getIntegrationsByCustomer.handler',
      'GET /api/runs/{integrationId}':
        'packages/functions/src/getRunsByIntegration.handler',
      'GET /api/missedruns/{customer}':
        'packages/functions/src/getMissedRunsByCustomer.handler',
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
