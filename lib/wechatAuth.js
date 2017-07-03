let Axios = require('axios')

module.exports = {
  sign: config => (req, res, next) => {
    let q = req.query;
    let signature = q.signature //微信加密签名
    let nonce = q.nonce //随机数
    let timestamp = q.timestamp //时间戳
    let echostr = q.echostr //随机字符串

    let token = config.wechat.Token
    /*
    1、将token、timestamp、nonce三个参数进行字典序排序
    2、将三个参数字符串拼接成一个字符串进行sha1加密
    3、开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
    */
    let str = [token, timestamp, nonce].sort().join('')
    let sha = require('sha1')(str)
    if (req.method == 'GET') {
      if (sha == signature) {
        res.send(echostr+'')
      } else {
        res.send('sign fail!')
      }
    }
    else if (req.method == 'POST') {
      next()
    }
  },

  auth: function (req, res, next) {
  },

  token: config => (req, res, next) => {
    let url = 'http://weixin.17kong.com/'
    let crypto = require('crypto')
    let querystring = require('querystring')
    let token = crypto.createHash('md5').update(Math.random() + 'genee').digest('hex')
    console.log('token', token)
    let info = {
      'wx-redirect': 'http://wx-csu.17kong.com/wechat/callback',
      'wx-token': token
    }
    let redirect = url + '?' + querystring.stringify(info)
    console.log('redirect', redirect)
    req.session.auth = true
    console.log('session', req.session)
    res.redirect(301, redirect)
  },

  entrance: config => (req, res, next) => {
    let token = req.query['wx-token']
    console.log(token)
    let Api = require('../src/store/api')
    let wechat = new Api('wechat')
    let user = new Api('user')
    Promise.resolve()
    .then(() => {
      return wechat.fetch(token)
    })
    .then(data => {
      return wechat.get(token)
    })
    .then(data => {
      console.log('通过token获取到的微信基本信息：', data)
      req.session.openid = data.openid
      req.session.unionid = data.unionid
      return user.fetch(data.openid)
    })
    .then(data => {
      console.log('getuserinfo 数据', data)
      if (!data) {
        return user.encall('gapper', req.session.unionid)
      } else {
        req.session.user = data
        res.redirect('/wechat/index')
      }
    })
    .then(data => {
      console.log('after gapper', data)
      if (!data) {
        res.redirect('/register')
      } else {
        req.session.user = data
        res.redirect('/register')
      }
    })
  }
}
