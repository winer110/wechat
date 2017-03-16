let _RPC = {}
let configs = require('../config/orm')

function getRPC (url) {
  if (!_RPC[url]) {
      let rpc = require('http-jsonrpc').connect(url)
      _RPC[url] = rpc
  }
  return _RPC[url]
}

class Indexed {
  constructor (name) {
    this.setConfig(name)
  }

  setConfig (name) {
    this.config = configs[name]
  }

  filter (criteria = {}) {
    this.criteria = criteria
    return this
  }

  fetch (start = 0, step = 10) {
    let config = this.config
    let criteria = this.criteria
    return new Promise((resolve, reject) => {
      let rpc = getRPC(config.url)
      rpc
        .call(config.search, [criteria])
        .done(data => {
          if (data) {
            rpc
            .call(config.getlist, [data.token, start, step])
            .done(resolve, reject)
          }
          else {
            reject(data)
          }
        }, reject)
    })
  }

  totalCount () {
    let config = this.config
    let criteria = this.criteria
    return new Promise((resolve, reject) => {
      let rpc = getRPC(config.url)
      rpc
        .call(config.search, [criteria])
        .done(resolve, reject)
    })
  }

}

module.exports = (name = 'equipment') => {
  return new Indexed(name)
}