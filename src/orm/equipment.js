let config = require('../../config/orm')
let orm = require('./orm')

module.exports = class Equipments {
  constructor () {
    Object.assign(this, orm)
  }

  token (...args) {
    let params = {
      criteria: {
        keywords: args[0]
      }
    }
    return this.rpcPost(config.equipment.url, config.equipment.search, params).then(res => {
      return res.data.result
    })
  }

  fetch (...args) {
    let params = {
      token: args[0],
      start: args[1],
      step: args[2]
    }
    return this.rpcPost(config.equipment.url, config.equipment.getlist, params).then(res => {
      return res.data.result
    })
  }

  get (...args) {
    return this.rpcPost(config.equipment.url, config.equipment.getEquipment, args).then(res => {
      return res.data.result
    })
  }
  status (...args) {
    let params = [
      args[0].uid,
      'equipment',
      args[0].uuid
    ]
    return this.rpcPost(config.user.url, config.equipment.status, params)
  }
  equipment (...args) {
    return this.rpcPost(config.equipment.url, config.equipment.getEquipment, args).then(res => {
      return res.data.result
    })
  }
}
