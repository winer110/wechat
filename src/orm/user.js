let config = require('../../config/orm')
let orm = require('./orm')

module.exports = class User {
  constructor () {
    Object.assign(this, orm)
  }

  fetch (...args) {
    let params = {
      id: args[0]
    }
    return this.rpcPost(config.user.url, config.user.get, params)
  }
  get (...args) {
    this.rpcPost('/api/decryptUserInfo').then(res => {
      console.log(res)
    })
    // let user = req.session.user
    // let code = args[0].code
    // let crypto = require('../../lib/crypto')
    // crypto.decrypt(code, (err, data) => {
    //   if (err) res.send(err)
    //   if (user && data.email === user.email) {
    //     crypto.encrypt(JSON.stringify(data), (err, d) => {
    //       if (err) res.send(err)
    //       res.send({success: 1, code: d});
    //     })
    //   } else {
    //     res.send({success: 0, data: '验证错误'})
    //   }
    // })
  }
}
