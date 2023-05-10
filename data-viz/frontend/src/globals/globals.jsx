export const customersAPI = import.meta.env.VITE_APP_API_URL + "/api/customers";
export const integrationsAPI =
  import.meta.env.VITE_APP_API_URL + "/api/integrations";


// it gets all runs for a particular integration
// the integrationId and number of days to query need to be passed alongside, via params
export const runsAPI = import.meta.env.VITE_APP_API_URL + "/api/runs";


// it gets all integrations for all customers
// it needs to pass the array of customers via params
export const allIntegrationsAPI = import.meta.env.VITE_APP_API_URL + "/api/allIntegrations";


// it gets all runs for all customers
// it needs to pass the array of customers via params
export const allRunsFromAllIntegrationsAPI = import.meta.env.VITE_APP_API_URL + "/api/allRunsFromAllIntegrations";

// it gets only one Run
// it needs to pass integration id (pk) and run id (id) via params
export const oneRunAPI = import.meta.env.VITE_APP_API_URL + "/api/getOnlyOneRun";
