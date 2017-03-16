let config = require('../../config/orm')
let orm = require('./orm')

module.exports = class Equipment {

  constructor () {
    Object.assign(this, orm)
  }

  fetch (...args) {
    return this.rpc().post(config.equipment.url, {
      'jsonrpc': '2.0',
      'method': config.equipment.getEquipment,
      'id': 1,
      'params': {
        'id': args[0]
      }
    }).then(res => {
      return res.data.result
    })
  }
}
