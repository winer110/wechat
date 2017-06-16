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
}
