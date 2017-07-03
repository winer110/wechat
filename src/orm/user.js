let config = require('../../config/orm')
let orm = require('./orm')

module.exports = class User {
  constructor () {
    Object.assign(this, orm)
  }

  fetch (...args) {
    return this.rpcPost(config.user.url, config.user.get, args).then(res => {
      return res.data.result
    })
  }
  get (...args) {
    this.rpcPost('/api/decryptUserInfo').then(res => {
      console.log(res)
    })
  }
  // 创建用户
  add (...args) {
    return this.rpcPost(config.user.url, config.user.create, args).then(res => {
      return res.data.result
    })
  }

  patch (...args) {
    return this.rpcPost(config.user.url, config.user.link, args).then(res => {
      return res.data.result
    })
  }

  delete (...args) {
    return this.rpcPost(config.user.url, config.user.identity, args).then(res => {
      return res.data.result
    })
  }

  gapper (...args) {
    return this.rpcPost(config.user.url, config.user.auth, args).then(res => {
      return res.data.result
    })
  }
  addGapper (...args) {
    return this.rpcPost(config.user.url, config.user.add, args).then(res => {
      console.log('addGapper', res)
      return res.data.result
    })
  }
}
