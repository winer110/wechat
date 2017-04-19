import io from 'socket.io-client'

new Vue({
  method: {
    // 获得用户状态
    getUseStatus () {
      let me = this
      let validationMessage = {
        id: me.$store.state.currentUser.id,
        email: me.$store.state.currentUser.email
      }
      let handlerListen = msg => {
        // 不走代理服务
        me.socket
          .on('auth-reback', data => {
            if (data.authed !== true) return false
            me.$http.post('/api/decryptUserInfo', {code: data.code}).then(res => {
              if (res.data.success) {
                let code = res.data.code
                console.log(code)
                
                let statusParams = {
                  equipment: me.equipment.uuid,
                  source_name: me.equipment.source_name,
                  uuid: `wechatUUID_{{me.equipment.uuid}}`
                }
                let checkParams = {
                  user: me.$store.state.currentUser.gapper_id,
                  equipment: me.equipment.uuid,
                  source_name: me.equipment.source_name,
                  user_info: {
                    gapper_id: me.$store.state.currentUser.gapper_id,
                    username: me.$store.state.currentUser.name,
                    email: me.$store.state.currentUser.email
                  },
                  uuid: `wechatUUID_{{me.equipment.uuid}}`
                }
                me.socket.emit('yiqikong-get-status', {
                  code: code,
                  form: JSON.stringify(statusParams)
                })
                me.socket.emit('yiqikong-check-permission', {
                  code: code,
                  form: JSON.stringify(checkParams)
                })
              }
            }, res => {
              console.log('decryptUserInfo-failed', res)
            })
          })
          .on('yiqikong-check-permission-reback', data => {
            if (data.success) {
              me.checkButtonText = data.params.permission === 'switchOff' ? 'on' : 'off'
              me.checkAction = data.params.result === true ? 1 : 0
            }
          })
          .on('yiqikong-get-status-reback', data => {
            if (data.success) {
              me.status = data.params.using === true ? 2 : 1
            } else {
              me.status = 3
            }
          })
          .emit('auth', { form: JSON.stringify(validationMessage) })
      }
      me.socket.connect()
        .on('connect', handlerListen)
        .on('connect_error', msg => {
        // 需要走代理服务
          console.log('connect failed!')
          me.socket.disconnect()
          me.socket = io.connect(me.proxyUrl, {
            path: '/socket.io',
            autoConnect: false,
            forceNew: true,
            timeout: 10000
          })
          validationMessage.source_name = me.equipment.source_name
          validationMessage.socket = {}
          me.socket.connect().on('connect', handlerListen)
          .on('connect_error', msg => {
            console.log('connect failed')
          })
        })
  }
})
