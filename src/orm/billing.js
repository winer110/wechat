let config = require('../../config/orm')
let orm = require('./orm')

module.exports = class Reserve {
  constructor () {
    Object.assign(this, orm)
  }

  fetch (...args) {
    return this.rpcPost(config.billing.url, config.billing.get, args).then(res => {
      return res.data.result
    })
  }
}
