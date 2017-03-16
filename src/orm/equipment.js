let Vue = require('vue')
let Axios = require('axios')
let config = require('../../config/orm')

Vue.prototype.$http = Axios

module.exports = class Equipment {
  constructor () {
    console.log(this._url)
    this._url = config.equipment.url
  }

  fetch () {
    return Vue.http.get(this._url).then(res => {
      return res.json()
    })
  }
}
