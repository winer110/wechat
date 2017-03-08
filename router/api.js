let express = require('express')
let router = express.Router()
let _O = require('../module/orm')
let _Indexed = require('../module/indexed')

router
  .use((req, res, next) => {
    next()
  })
  .post('/searchEquipments', (req, res) => {
    let Indexed = _Indexed('equipment')
    let O = _O('equipment')
    let params = req.body || {}
    Indexed
    .filter({
      keywords: params.keywords
    })
    .fetch(params.start, params.step).done(data => {
      let arr = []
      let promise = Promise.resolve()
      for (let i in data) {
        promise = promise.then(() => {
          return O.fetch(i).then(data => {
            arr.push(data)
          })
        })
      }
      promise.done(() => {
        res.send(arr)
      })
    }, data => {
      res.send([])
    })
  })
  .post('/getEquipment', (req, res) => {
    _O('equipment').fetch(req.body.id).done(data => {
      res.send(data)
    }, data => {
      res.send({})
    })
  })
  .post('/getUser', (req, res) => {
    res.send('getUser')
  })
  .post('/searchSamples', (req, res) => {
    res.send('searchSamples')
  })
  // 获取当天其他人的所有预约情况
  .post('/searchReserves', (req, res) => {
    let Indexed = _Indexed('reserve')
    let O = _O('reserve')
    let params = req.body || {}
    console.log('params', params)
    Indexed
    .filter({
      equipment: params.uuid,
      equipment_condition: '=',
      start_time: params.startTime,
      start_time_condition: '>=',
      end_time: params.endTime,
      end_time_condition: '<='
    })
    .fetch(0, 10).done(data => {
      let arr = []
      let promise = Promise.resolve()
      for (let i in data) {
        promise = promise.then(() => {
          return O.fetch(i).then(data => {
            arr.push(data)
          })
        })
      }
      promise.done(() => {
        res.send(arr)
      })
    }, data => {
      res.send({})
    })
  })
  // 获取关注对象的列表信息
  .post('/searchFollows', (req, res) => {
    let Indexed = _Indexed('follow')
    let O = _O('equipment')
    let params = req.body || {}
    Indexed
    .filter({
      id: params.id,
      source_name: 'equipment'
    })
    .fetch(params.start, params.step).done(data => {
      let arr = []
      let promise = Promise.resolve()
      for (let i in data) {
        promise = promise.then(() => {
          return O.fetch(data[i].source_uuid).then(data => {
            arr.push(data)
          })
        })
      }
      promise.done(() => {
        res.send(arr)
      })
    }, data => {
      res.send([])
    })
  })
  // 用于获取当前用户对于仪器的关注状态
  .post('/getEquipmentFollowStatus', (req, res) => {
    let O = _O('follow')
    let params = req.body || {}
    O.fetch(params.uid, 'equipment', params.uuid).then(data => {
      res.send({ id: data})
    }, data => {
      res.send({ id: 0 })
    })
  })
  // 进行socket.io auth之后的解密操作
  .post('/decryptUserInfo', (req, res) => {
    let params = req.body || {}
    let user = req.session.user
    let code = params.code
    let crypto = require('../lib/crypto')
    crypto.decrypt(code, (err, data) => {
      if(err) res.send(err)
      if(user && data.email == user.email) {
        crypto.encrypt(JSON.stringify(data), (err, d) => {
          if(err) res.send(err)
          res.send({success: 1, code: d});
        })
      } else {
        res.send({success: 0, data: '验证错误'})
      }
    })
  })

module.exports = router
