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
      'id': 1,
      'criteria': {
        equipment: args[0].uuid,
        equipment_condition: '=',
        start_time: args[0].startTime,
        start_time_condition: '>=',
        end_time: args[0].endTime,
        end_time_condition: '<='
      }
    }
    console.log(params)
    return this.rpcPost(config.reserve.url, 'YiQiKong/Reserve/GetReservation', params)
  }
}
