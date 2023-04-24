import { Api } from 'sst/constructs'

export function API({ stack }) {
  const api = new Api(stack, 'api', {
    routes: {
      'GET /': 'packages/functions/src/lambda.handler',
      'GET /integrations': 'packages/functions/src/getIntegrations.handler',
    },
  })
  stack.addOutputs({
    ApiEndpoint: api.url,
  })

  return {
    api,
  }
}
