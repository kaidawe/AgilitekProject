import { API } from './stacks/ApiStack'
import { Frontend } from './stacks/FrontendStack'

export default {
  config(_input) {
    return {
      name: 'data-viz',
      profile: 'agilitek',
      region: 'us-east-1',
    }
  },
  stacks(app) {
    app.stack(API).stack(Frontend)
  },
}
