import { StaticSite, use } from 'sst/constructs'
import { API } from './ApiStack'

export function Frontend({ stack }) {
  const { api } = use(API)

  const site = new StaticSite(stack, 'ReactSite', {
    path: 'frontend',
    buildOutput: 'dist',
    buildCommand: 'vite build',
    // Pass in environment variables
    environment: {
      VITE_APP_API_URL: api.customDomainUrl || api.url,
    },
  })

  // Show the url in the output
  stack.addOutputs({
    SiteUrl: site.url || '',
  })
}
