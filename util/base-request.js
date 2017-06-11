// base-request.js contains the default setting of the request that makes a call to the github endpoint

const config = require('../config.json')

const r = request.defaults({
  headers: {
    'User-Agent': 'request',
    'Authorization': `token ${config.access_token}`
  },
  json: true
})

module.exports = r
