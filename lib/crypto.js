/**
 * 加解密模块
 */
let fs = require('fs')
let crypto = require("crypto")

module.exports = {
  decrypt: (code, callback) => {
    fs.readFile(__dirname + '/key/first_private_key', "utf8", (err, privateKey) => {
      if(err) {
        console.log('没有获取到私钥内容');
      } else {
        let buffer = new Buffer(code, 'base64')
        let decrypted = crypto.privateDecrypt(privateKey, buffer)
        let data = JSON.parse(decrypted.toString())
        callback(null, data)
      }
    })
  },
  encrypt: (code, callback) => {
    fs.readFile(__dirname + '/key/second_public_key', "utf8", (err, publicKey) => {
      if(err) {
        callback(err)
      } else {
        let buffer = new Buffer(code)
        let encrypted = crypto.publicEncrypt(publicKey, buffer)
        let encrypted_base64 = encrypted.toString("base64")
        callback(null, encrypted_base64)
      }
    })
  }
}