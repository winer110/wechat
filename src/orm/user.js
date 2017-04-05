let config = require('../../config/orm')
let orm = require('./orm')

module.exports = class User {
  constructor () {
    Object.assign(this, orm)
  }

  fetch (...args) {
    let params = {
      id: args[0]
    }
    return this.rpcPost(config.user.url, config.user.get, params)
  }
}
