module.exports = {
  wechat: {
    Token: "Genee83719730",
    appID: "wx662e5d74aedf7293",
    appsecret: "b512ae1443f81c91a711287b1b72a34e",
    URL: "http://wx-csu.17kong.com/"
  },
  menu: {
    "button": [{
      "type": "scancode_push",
      "name": "扫码",
      "key": "V1001_TODAY_MUSIC"
    },{
      "name": "仪器服务",
      "type": "view",
      "url": "http://wx-csu.17kong.com/wechat"
    },{
      "name": "帮助",
      "sub_button":[
        {
          "type": "view",
          "name": "账号绑定说明",
          "url": "http://wx-csu.17kong.com/wechat/help"
        },{
          "type": "view",
          "name": "联系客服",
          "url": "https://support17kong.kf5.com/kchat/20680?from=%E5%9C%A8%E7%BA%BF%E6%94%AF%E6%8C%81#livechat"
        }
      ]
    }]
  }
}
