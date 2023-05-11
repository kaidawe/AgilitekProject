import { Api } from 'sst/constructs'

export function API({ stack }) {
  stack.setDefaultFunctionProps({
    timeout: 400,
  })
  const api = new Api(stack, 'api', {
    routes: {
      'GET /api/customers': 'packages/functions/src/getCustomers.handler',
      'GET /api/integrations/{customer}':
        'packages/functions/src/getIntegrationsByCustomer.handler',
      'GET /api/runs': 'packages/functions/src/getRunsByIntegration.handler',

      // adding new lambda function to grab all integrations on DB
      'GET /api/allIntegrations':
        'packages/functions/src/getAllIntegrations.handler',

      // adding new lambda function to grab all run from all integrations on DB
      'GET /api/allRunsFromAllIntegrations':
        'packages/functions/src/getAllRunsFromAllIntegrationsToAllCustomers.handler',

      // it gets only one run
      'GET /api/getOnlyOneRun': 'packages/functions/src/getOnlyOneRun.handler',
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
