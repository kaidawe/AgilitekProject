import { Api } from "sst/constructs";

export function API({ stack }) {
  stack.setDefaultFunctionProps({
    timeout: 400,
  });
  const api = new Api(stack, "api", {
    routes: {
      "GET /api/customers": "packages/functions/src/getCustomers.handler",

      // lambda function to grab all integrations on DB
      "GET /api/integrations":
        "packages/functions/src/getAllIntegrations.handler",

      // lambda function to grab all run from all integrations on DB
      "GET /api/runsByIntegrationList":
        "packages/functions/src/getRunsByIntegrationList.handler",

      // lambda function to get only one run
      "GET /api/runByID": "packages/functions/src/getSingleRunByID.handler",
    },
  });
  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  api.attachPermissions(["dynamodb"]);

  return {
    api,
  };
}
