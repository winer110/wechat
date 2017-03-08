let _RPC = {}
let config = require('../config/orm')

function getRPC (url) {
  if (!_RPC[url]) {
      let rpc = require('http-jsonrpc').connect(url)
      _RPC[url] = rpc
  }
  return _RPC[url]
}

class Follow {
  fetch (...params) {
    return new Promise((resolve, reject) => {
      let rpc = getRPC(config.user.url)
      rpc
        .call('YiQiKong/Follow/getFollow', params)
        .done((data) => {
          this.convertData(data)
          resolve(this._data)
        }, reject)
    })
  }

  convertData (data) {
    this._data = data
  }
}

module.exports = Follow
