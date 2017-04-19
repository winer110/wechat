let config = require('../../config/orm')
let orm = require('./orm')

module.exports = class Equipments {
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
    let params = {
      token: args[0],
      start: args[1],
      step: args[2]
    }
    return this.rpcPost(config.equipment.url, config.equipment.getlist, params)
  }

  get (...args) {
    let params = {
      'id': args[0]
    }
    return this.rpcPost(config.equipment.url, config.equipment.getEquipment, params)
  }

  status (...args) {
    let params = [
      args[0].uid,
      'equipment',
      args[0].uuid
    ]
    return this.rpcPost(config.user.url, config.equipment.status, params)
  }
}
