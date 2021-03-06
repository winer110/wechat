let config = require('../../config/orm')
let orm = require('./orm')

module.exports = class Reserve {
  constructor () {
    Object.assign(this, orm)
  }

  token (...args) {
    return this.rpcPost(config.sample.url, config.sample.search, [{
      user: args[0],
      'user_condition': '=',
      orderby: [['submit_time', 'desc']]
    }]).then(res => {
      return res.data.result
    })
  }

  fetch (...args) {
    let params = {
      'criteria': {
        equipment: args[0].uuid,
        equipment_condition: '=',
        start_time: args[0].startTime,
        start_time_condition: '>=',
        end_time: args[0].endTime,
        end_time_condition: '<='
      }
    }
    return this.rpcPost(config.reserve.url, 'YiQiKong/Reserve/SearchReservations', params).then(res => {
      if (res.data.result) {
        let param = {
          token: res.data.result.token,
          start: 0,
          num: res.data.result.total
        }
        return this.rpcPost(config.reserve.url, config.reserve.getlist, param).then(res => {
          return res.data.result
        })
      } else {
        return false
      }
    })
  }

  get (...args) {
    return Promise.resolve()
    .then(() => {
      return this.rpcPost(config.sample.url, config.sample.add, args)
    })
    .then(res => {
      args[0].source_name = 'eq_sample'
      return this.rpcPost(config.billing.url, config.billing.add, {data: args[0]})
    })
  }

  list (...args) {
    return this.rpcPost(config.sample.url, config.sample.getlist, [args[0].token, args[0].count, args[0].step]).then(res => {
      return res.data.result
    })
  }
}
