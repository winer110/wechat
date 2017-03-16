let config = require('../../config/orm')
let orm = require('./orm')

module.exports = class Equipment {

  constructor () {
    Object.assign(this, orm)
  }

  getToken () {    
    if (this.token === undefined) {
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
        this.token = res.data.result.token
        this.total = res.data.result.totalCount
        return Promise.resolve(this.token)
      })
    } else {
      return Promise.resolve(this.token)
    }
  }

  fetch (params) {
    return this.getToken().then(token => {
      return this.rpc().post(config.equipment.url, {
        'jsonrpc': '2.0',
        'method': config.equipment.getlist,
        'id': 1,
        'params': {
          token: token,
          start: params.start,
          step: params.step
        }
      }).then(res => {
        return res.data.result
      })
    })
  }
}
