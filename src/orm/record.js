let config = require('../../config/orm')
let orm = require('./orm')

module.exports = class Reserve {
  constructor () {
    Object.assign(this, orm)
  }

  token (...args) {
    return this.rpcPost(config.record.url, config.record.search, [{
      user: args[0],
      'user_condition': '=',
      orderby: [['ctime', 'desc']]
    }]).then(res => {
      return res.data.result
    })
  }

  list (...args) {
    return this.rpcPost(config.record.url, config.record.list, [args[0].token, args[0].count, args[0].step]).then(res => {
      return res.data.result
    })
  }
}
