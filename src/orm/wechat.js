let config = require('../../config/orm')
let orm = require('./orm')

module.exports = class Wechat {
  constructor () {
    Object.assign(this, orm)
  }

  fetch (...args) {
    return this.rpcPost(config.gateway.url, config.gateway.get, args).then(res => {
      return res.data.result
    })
  }

  get (...args) {
    return this.rpcPost(config.gateway.url, config.gateway.info, args).then(res => {
      return res.data.result
    })
  }
}
