let config = require('../../config/orm')
let orm = require('./orm')

module.exports = class User {
  constructor () {
    Object.assign(this, orm)
  }

  fetch (...args) {
    return this.rpcPost(config.user.url, config.user.get, args).then(res => {
      return res.data
    })
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
  follow (...args) {
    return this.rpcPost(config.follow.url, config.follow.search, args).then(res => {
      return res.data.result
    })
  }
  equipments (...args) {
    return this.rpcPost(config.follow.url, config.follow.getlist, args).then(res => {
      return res.data.result
    })
  }
}
