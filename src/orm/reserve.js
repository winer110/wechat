let config = require('../../config/orm')
let orm = require('./orm')

module.exports = class Reserve {
  constructor () {
    Object.assign(this, orm)
  }

  fetch (...args) {
    // let params = {
    //   equipment: args[0].uuid,
    //   equipment_condition: '=',
    //   start_time: args[0].startTime,
    //   start_time_condition: '>=',
    //   end_time: args[0].endTime,
    //   end_time_condition: '<='
    // }
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
      if (res.result) {
        let param = {
          token: res.result.token,
          start: 0,
          num: res.result.total
        }
        return this.rpcPost(config.reserve.url, config.reserve.getlist, param).then(res => {
          return res.result
        })
      } else {
        return false
      }
    })
  }
}
