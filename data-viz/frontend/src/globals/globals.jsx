export const customersAPI = import.meta.env.VITE_APP_API_URL + 'api/customers'
export const integrationsAPI =
  import.meta.env.VITE_APP_API_URL + '/api/integrations'


// it gets all runs for a particular integration
// the integrationId need to be passed alongside, such as:
// const url = runsAPI + `/${encodeURIComponent("INTEGRATION#01GHVDYH1YPWQBKDBZPS310KNG")}`;
export const runsAPI = import.meta.env.VITE_APP_API_URL + '/api/runs';