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

  auth: config => (req, res, next) => {
    let OAuth = require('wechat-oauth')
    let client = new OAuth(config.wechat.appID, config.wechat.appsecret)
    if (req.query.code) {
      client.getAccessToken(req.query.code, (err, result) => {
        let accessToken = result.data.access_token
        let openid = result.data.openid
        let O = require('../module/orm')
        O('user').fetch('o_UpduMUIn7STnCe9vpZ8EfVqlIg').done(data => {
          req.session.user = data
          res.redirect('/wechat/index')
        }, data => {
          // TODO 等待后续处理
        })
      })
    } else {
      res.redirect(client.getAuthorizeURL('http://wx-csu.17kong.com/wechatAuth', 'state', 'snsapi_userinfo'))
    }
  }
}