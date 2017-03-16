let Vue = require('vue')
let Axios = require('axios')
let config = require('../../config/orm')

Vue.prototype.$http = Axios

module.exports = class User {
  constructor () {
    let rpc = config.user.url
    console.log(`test the ::: ${rpc}`)
  }

  fetch () {
  }
}
