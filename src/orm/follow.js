let config = require('../../config/orm')
let orm = require('./orm')

module.exports = class Equipments {
  constructor () {
    Object.assign(this, orm)
  }

  token (...args) {
    return this.rpcPost(config.follow.url, config.follow.search, args).then(res => {
      return res.data.result
    })
  }
  fetch (...args) {
    let params = {
      token: args[0],
      start: args[1],
      step: args[2]
    }
    return this.rpcPost(config.follow.url, config.follow.getlist, params).then(res => {
      return res.data.result
    })
  }
}
