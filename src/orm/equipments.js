let config = require('../../config/orm')
let orm = require('./orm')

module.exports = class Equipment {

  constructor () {
    Object.assign(this, orm)
  }

  token () {
    return this.rpc().post(config.equipment.url, {
      'jsonrpc': '2.0',
      'method': config.equipment.search,
      'id': 1,
      'params': {
        'criteria': {
          'keywords': ''
        }
      }
    }).then(res => {
      return Promise.resolve(res.data.result)
    })
  }

  fetch (...args) {
    return this.rpc().post(config.equipment.url, {
      'jsonrpc': '2.0',
      'method': config.equipment.getlist,
      'id': 1,
      'params': {
        token: args[0],
        start: args[1],
        step: args[2]
      }
    }).then(res => {
      return res.data.result
    })
  }
}
